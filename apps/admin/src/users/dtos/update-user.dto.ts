import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { Department } from 'libs/db/models/department.model';
import { Role } from 'libs/db/models/role.model';
import { UserStatus, SexEnum } from 'libs/db/models/user.model';

export class UpdateUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @MaxLength(20, {
    message: '用户名长度不能超过20位',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '用户名', example: 'visionwuwu' })
  username: string;

  // @IsNotEmpty({
  //   message: '密码不能为空',
  //   context: { errorCode: ApiStatusCode.ERROR_CODE },
  // })
  // @MinLength(6, {
  //   message: '密码长度不能小于6',
  //   context: { errorCode: ApiStatusCode.ERROR_CODE },
  // })
  // @MaxLength(15, {
  //   message: '密码长度不能大于15',
  //   context: { errorCode: ApiStatusCode.ERROR_CODE },
  // })
  // @ApiProperty({ title: '密码', example: '123456' })
  // password: string;

  @IsNotEmpty({
    message: '昵称不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @MaxLength(20, {
    message: '用户昵称长度不能大于20',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '昵称', example: '用户昵称' })
  nickname: string;

  @IsNotEmpty({
    message: '手机号不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '手机号', example: '+86137******9894' })
  mobile: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @IsEmail()
  @ApiProperty({ title: '邮箱', example: '2020xxxx@qq.com' })
  email: string;

  @ApiProperty({ title: '头像', example: 'file.jpg' })
  avatar?: string;

  @IsInt({
    message: '用户性别是 男性 1 女性 2 未知 3的数字',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({
    title: '性别',
    example: 1,
    description: '男性 1 女性 2 未知 3',
  })
  sex?: SexEnum;

  @IsInt({
    message: '用户状态是 启用 1 禁用 0这种类型的数字',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({
    title: '用户状态',
    example: 1,
    description: '启用 1 禁用 0',
  })
  status: UserStatus;

  @IsString()
  @ApiProperty({
    title: '用户备注',
    example: 'this is a very good blog system',
  })
  remark?: string;

  @IsNotEmpty()
  @ApiProperty({ title: '用户拥有角色的mongooseId', example: [] })
  roleIdList?: Role[];

  @ApiProperty({ title: '用户所属部门', example: '' })
  deptId?: Department;
}
