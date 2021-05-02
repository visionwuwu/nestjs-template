import { ApiProperty } from '@nestjs/swagger';

export class MenuListQueryDto {
  @ApiProperty({ title: '菜单名称', example: '首页', required: false })
  name: string;

  @ApiProperty({ title: '菜单状态', example: 1, required: false })
  status?: number;
}
