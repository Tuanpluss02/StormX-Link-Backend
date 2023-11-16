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
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    // const response = context.switchToHttp().getResponse();
    const userAgent = request.get("user-agent") || "";
    const { ip, method, path: url } = request;

    // const { statusCode } = response;
    const now = Date.now();
    // this.logger.log(
    //   `${method} ${url} ${statusCode} - ${userAgent} ${ip}: ${Date.now() - now
    //   }ms`,
    // );


    return next.handle().pipe(
      tap((res) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get("content-length");

        this.logger.log(
          `${method} ${url} ${statusCode} - ${userAgent} ${ip}: ${Date.now() - now
          }ms`,
        );

      }),
    );
  }
}
