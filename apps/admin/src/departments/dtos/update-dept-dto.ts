import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { DepartmentStatus } from 'libs/db/models/department.model';
export class UpdateDeptDto {
  @IsNotEmpty({
    message: '部门名称不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '部门名称', example: '橙晨燕公司' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ title: '上级部门Id', example: '' })
  parentId: string;

  @IsNotEmpty({
    message: '部门排序不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @IsInt({
    message: '部门排序号必须为数字',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @Min(0, {
    message: '部门排序号最小为0',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '部门排序不能为空', example: 0 })
  orderId: number;

  @ApiProperty({ title: '部门负责人', example: 'Visionwuwu' })
  leader?: string;

  @IsEmail()
  @ApiProperty({ title: '邮箱', example: '2021664244@qq.com' })
  email?: string;

  @ApiProperty({ title: '联系电话', example: '13767679897' })
  mobile?: string;

  @IsInt({
    message: '菜单状态只能为数字',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '部门状态', example: 1 })
  status: DepartmentStatus;
}
