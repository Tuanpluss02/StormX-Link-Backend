import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === "string") {
        message = errorResponse;
      } else if (typeof errorResponse === "object" && errorResponse !== null) {
        message = (errorResponse as any).message || exception.message;
      } else {
        message = exception.message;
      }
    } else {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Internal server error";

      // Log unexpected errors with full details
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
        `${request.method} ${request.url}`,
      );
    }

    // Log error details
    this.logger.error(
      `HTTP ${status} Error: ${request.method} ${
        request.url
      } - ${JSON.stringify(message)}`,
    );

    // Construct error response
    const errorResponse = {
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // Add request ID if available (useful for tracing)
    if (request.headers["x-request-id"]) {
      (errorResponse as any).requestId = request.headers["x-request-id"];
    }

    response.status(status).json(errorResponse);
  }
}
