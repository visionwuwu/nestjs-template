import { ApiProperty } from '@nestjs/swagger';

export class UserListQueryDto {
  @ApiProperty({
    title: '用户名',
    example: 'visionwuwu',
    required: false,
    default: '',
  })
  username?: string;

  @ApiProperty({
    title: '昵称',
    example: '用户昵称',
    required: false,
    default: '',
  })
  nickname?: string;

  @ApiProperty({
    title: '部门id',
    example: '',
  })
  deptId?: string;

  @ApiProperty({ title: '当前页', example: 1, required: false, default: 1 })
  pageNumber?: number;

  @ApiProperty({ title: '每页条数', example: 10, required: false, default: 10 })
  pageSize?: number;
}
