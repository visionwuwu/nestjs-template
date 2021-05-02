import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '用户名', example: 'visionwuwu' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '密码', example: '123456' })
  password: string;
}
