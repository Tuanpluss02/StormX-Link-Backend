import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import e, { Request, Response } from "express";
import { ValidationError } from "class-validator";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.debug(exception.name);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const validationErrors = exception.getResponse()["message"];

    response.status(status).json({
      statusCode: status,
      message: validationErrors || message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
