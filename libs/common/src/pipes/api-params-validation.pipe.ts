import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ApiStatusCode } from '../enums/api-status-code.enum';
import { ApiException } from '../exceptions/ApiException';

@Injectable()
export class ApiParamsValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    /** 如果参数不是类 而是普通Javascript对象 不进行验证 */
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    /** 使用class-transformer的plainToClass方法来转化Javascript对象为可验证的参数 */
    const object = plainToClass(metatype, value);

    const errors = await validate(object);
    if (errors.length > 0) {
      /** 获取到第一个没有通过验证的错误对象 */
      const error = errors.shift();
      const constraints = error.constraints;
      const contexts = error.contexts;

      /** 将未通过验证的字段的错误信息和状态码，以ApiException的形式抛给我们的全局异常过滤器 */
      for (const key of Object.keys(constraints)) {
        throw new ApiException(
          constraints[key],
          HttpStatus.BAD_REQUEST,
          contexts ? contexts[key].errorCode : ApiStatusCode.ERROR_CODE,
        );
      }
    }
    return value;
  }

  /** 验证元数据类型，是否为普通的JavaScript对象 */
  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
