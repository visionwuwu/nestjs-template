import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, prop, ReturnModelType } from '@typegoose/typegoose';
import { Role } from 'libs/common/enums/role.enum';
import { Department } from './department.model';

export type RoleMenuDocument = DocumentType<RoleDept>;

export type RoleMenuModelType = ReturnModelType<typeof RoleDept>;

export class RoleDept {
  @prop({
    ref: 'Role',
    required: true,
  })
  @ApiProperty({ title: '角色Id', example: '' })
  role_id: Role;

  @prop({
    ref: 'Department',
    required: true,
  })
  @ApiProperty({ title: '部门Id', example: '' })
  menu_id: Department;
}
