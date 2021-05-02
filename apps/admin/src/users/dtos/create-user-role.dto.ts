import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { IsNotEmpty } from 'class-validator';
import { Role } from 'libs/common/enums/role.enum';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { User } from 'libs/db/models/user.model';

export class UserRole {
  @IsNotEmpty({
    message: '用户Id不能为空',
    context: { errroCode: ApiStatusCode.ERROR_CODE },
  })
  @prop({
    required: true,
  })
  @ApiProperty({ title: '用户Id', example: '' })
  user_id: User;

  @IsNotEmpty({
    message: '角色Id不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @prop({
    required: true,
  })
  @ApiProperty({ title: '角色Id', example: '' })
  role_id: Role;
}
