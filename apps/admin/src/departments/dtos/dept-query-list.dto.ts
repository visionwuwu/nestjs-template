import { ApiProperty } from '@nestjs/swagger';

export class DeptListQueryDto {
  @ApiProperty({ title: '部门名称', example: '研发部', required: false })
  name: string;

  @ApiProperty({ title: '部门状态', example: '0 禁用 1 启用', required: false })
  status?: number;

  @ApiProperty({ title: '当前页', example: 1, required: false, default: 1 })
  pageNumber?: number;

  @ApiProperty({ title: '每页条数', example: 10, required: false, default: 10 })
  pageSize?: number;
}
