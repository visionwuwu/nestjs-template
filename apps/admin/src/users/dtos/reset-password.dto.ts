import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { UserType } from 'libs/db/models/user.model';

export class ResetPasswordDto {
  @IsNotEmpty({
    message: '用户Id不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '用户Id', example: '' })
  id: string;

  @IsNotEmpty({
    message: '密码不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @MinLength(6, {
    message: '密码长度不能小于6',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @MaxLength(15, {
    message: '密码长度不能大于15',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '密码', example: '123456' })
  password: string;

  @IsNotEmpty({
    message: '用户类型不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '用户类型', example: 1 })
  type: UserType;
}
