import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { MenuStatus, MenuType } from 'libs/db/models/menu.model';

export class CreateMenuDto {
  @IsNotEmpty({
    message: '菜单名称不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '菜单名称', example: '首页' })
  name: string;

  @ApiProperty({ title: '菜单图标', example: 'HomeOutlined' })
  icon?: string;

  @ApiProperty({ title: '菜单路径', example: '/dashboard' })
  path?: string;

  @ApiProperty({ title: '父级菜单', example: '' })
  parentId?: string;

  @IsNotEmpty({
    message: '菜单排序不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @IsInt({
    message: '菜单排序号必须为数字',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @Min(0, {
    message: '菜单排序号最小为0',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '菜单排序不能为空', example: 0 })
  orderId?: number;

  @ApiProperty({ title: '菜单权限标识', example: 'system:user:list' })
  perms?: string;

  @IsNotEmpty({
    message: '菜单类型不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '菜单类型', example: 'M 目录 C 菜单 B 按钮' })
  type?: MenuType;

  @IsInt({
    message: '菜单状态只能为数字',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '菜单状态', example: '0 禁用 1 启用' })
  status?: MenuStatus;

  @ApiProperty({ title: '菜单描述', example: '一级菜单' })
  remark?: string;
}
