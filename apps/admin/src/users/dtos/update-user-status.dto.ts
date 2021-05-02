import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { UserStatus, UserType } from 'libs/db/models/user.model';

export class UpdateUserStatusDto {
  @IsNotEmpty({
    message: '用户Id不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '用户Id', example: '' })
  id: string;

  @IsInt({
    message: '用户状态是 启用 1 禁用 0这种类型的数字',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({
    title: '用户状态',
    example: 1,
    description: '启用 1 禁用 0',
  })
  status: UserStatus;

  @IsNotEmpty({
    message: '用户类型不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '用户类型', example: 1 })
  type: UserType;
}
