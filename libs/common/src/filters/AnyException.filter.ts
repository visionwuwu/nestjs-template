import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorObject =
      exception instanceof HttpException
        ? typeof exception.getResponse() === 'object'
          ? (exception.getResponse() as any)
          : { message: exception }
        : { message: exception };

    response.status(status).json({
      statusCode: status,
      ...errorObject,
      timestamps: new Date().toISOString(),
      path: request.url,
    });
  }
}
