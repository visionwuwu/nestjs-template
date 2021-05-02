import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';

export class RoleListQueryDto {
  @ApiProperty({ title: '角色名', example: 'admin', required: false })
  name: string;

  @ApiProperty({ title: '权限标识', example: 'admin', required: false })
  roleKey?: string;

  @ApiProperty({ title: '角色状态', example: '0 禁用 1 启用', required: false })
  status?: number;

  @ApiProperty({ title: '当前页', example: 1, required: false, default: 1 })
  pageNumber?: number;

  @ApiProperty({ title: '每页条数', example: 10, required: false, default: 10 })
  pageSize?: number;
}
