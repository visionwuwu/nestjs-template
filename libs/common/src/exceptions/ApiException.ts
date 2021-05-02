// 自定义Api异常处理
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiStatusCode } from '../enums/api-status-code.enum';

export class ApiException extends HttpException {
  // private ObjectOrError: Record<string, any> | string;
  private errorCode: ApiStatusCode;

  constructor(
    response: string | Record<string, any>,
    statusCode: HttpStatus,
    errorCode: ApiStatusCode,
  ) {
    super(response, statusCode);
    this.errorCode = errorCode;
  }

  public getErrorCode(): ApiStatusCode {
    return this.errorCode;
  }
}
