import { ApiProperty } from '@nestjs/swagger';
import { arrayProp } from '@typegoose/typegoose';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { Menu } from 'libs/db/models/menu.model';
import { RoleStatus } from 'libs/db/models/role.model';

export class CreateRoleDto {
  @IsNotEmpty({
    message: '角色名不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @MaxLength(20, {
    message: '角色名长度不能超过20个字符',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '角色名', example: 'admin' })
  name: string;

  @IsNotEmpty({
    message: '权限标识不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '权限标识', example: 'admin' })
  roleKey?: string;

  @arrayProp({
    ref: 'Menu',
  })
  @ApiProperty({ title: '角色拥有菜单权限', example: [] })
  menuIdList?: Menu[];

  @IsNotEmpty({
    message: '角色排序不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @IsInt({
    message: '排序号必须为数字',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @Min(0, {
    message: '排序号最小值为0',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '角色排序', example: 0 })
  orderId?: number;

  @IsNotEmpty({
    message: '角色状态不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @IsInt({
    message: '角色状态必须是数字',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '角色状态', example: '0 禁用 1 启用' })
  status?: RoleStatus;

  @IsString({
    message: '角色描述必须为字符串',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @MaxLength(100, {
    message: '角色描述字符个数最大为100',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '角色描述', example: '超级管理员' })
  remark?: string;
}
