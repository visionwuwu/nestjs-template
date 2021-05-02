import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { Department } from 'libs/db/models/department.model';

export class DataScopeDto {
  @IsNotEmpty({
    message: '角色Id不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '角色Id', example: '' })
  id: string;

  @ApiProperty({ title: '拥有部门', example: '' })
  deptIds?: Department[];
}
