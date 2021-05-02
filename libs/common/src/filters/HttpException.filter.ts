import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiException } from '../exceptions/ApiException';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (exception instanceof ApiException) {
      response.status(status).json({
        code: exception.getErrorCode(),
        message: exception.getResponse(),
        timestamps: new Date().toISOString(),
        path: request.url,
      });
    } else if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      const message =
        typeof errorResponse === 'string'
          ? { message: errorResponse }
          : { ...errorResponse };
      response.status(status).json({
        code: status,
        ...message,
        timestamps: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
