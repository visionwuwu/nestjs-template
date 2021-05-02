import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, prop, ReturnModelType } from '@typegoose/typegoose';
import { Role } from 'libs/common/enums/role.enum';
import { Menu } from './menu.model';

export type RoleMenuDocument = DocumentType<RoleMenu>;

export type RoleMenuModelType = ReturnModelType<typeof RoleMenu>;

export class RoleMenu {
  @prop({
    ref: 'Role',
    required: true,
  })
  @ApiProperty({ title: '角色Id', example: '' })
  role_id: Role;

  @prop({
    ref: 'Menu',
    required: true,
  })
  @ApiProperty({ title: '菜单Id', example: '' })
  menu_id: Menu;
}
