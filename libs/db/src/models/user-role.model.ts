import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, prop, ReturnModelType } from '@typegoose/typegoose';
import { Role } from 'libs/common/enums/role.enum';
import { User } from './user.model';

export type UserRoleDocument = DocumentType<UserRole>;

export type UserRoleModelType = ReturnModelType<typeof UserRole>;

export class UserRole {
  @prop({
    ref: 'User',
    required: true,
  })
  @ApiProperty({ title: '用户Id', example: '' })
  user_id: User;

  @prop({
    ref: 'Role',
    required: true,
  })
  @ApiProperty({ title: '角色Id', example: '' })
  role_id: Role;
}
