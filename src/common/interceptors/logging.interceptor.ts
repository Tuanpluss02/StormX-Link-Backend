import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const userAgent = request.get("user-agent") || "";
    const { ip, method, path: url } = request;
    const startTime = Date.now();

    // Log request
    this.logger.log(`Incoming Request: ${method} ${url} - ${userAgent} ${ip}`);

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const { statusCode } = response;
          const responseTime = Date.now() - startTime;

          // Log response
          this.logger.log(
            `Response: ${method} ${url} ${statusCode} - ${userAgent} ${ip}: ${responseTime}ms`,
          );

          // Log performance warnings for slow requests
          if (responseTime > 1000) {
            this.logger.warn(
              `Slow request detected: ${method} ${url} took ${responseTime}ms`,
            );
          }

          // Log data size for large responses
          if (responseData && typeof responseData === "object") {
            const responseSize = JSON.stringify(responseData).length;
            if (responseSize > 10000) {
              // 10KB
              this.logger.warn(
                `Large response detected: ${method} ${url} - ${responseSize} bytes`,
              );
            }
          }
        },
        error: (error) => {
          const { statusCode } = response;
          const responseTime = Date.now() - startTime;

          this.logger.error(
            `Error Response: ${method} ${url} ${statusCode} - ${userAgent} ${ip}: ${responseTime}ms`,
            error.stack,
          );
        },
      }),
    );
  }
}
