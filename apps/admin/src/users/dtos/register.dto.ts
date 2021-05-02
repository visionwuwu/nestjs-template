import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';

export class RegisterDto {
  @IsNotEmpty({
    message: '用户名不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '用户名', example: 'Visionwuwu' })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '密码', example: '123456' })
  password: string;
}
