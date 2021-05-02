import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { RoleStatus, RoleType } from 'libs/db/models/role.model';

export class UpdateRoleStatusDto {
  @IsNotEmpty({
    message: '角色Id不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '角色Id', example: '' })
  id: string;

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

  @IsNotEmpty({
    message: '角色类型不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '角色类型', example: 0 })
  type?: RoleType;
}
