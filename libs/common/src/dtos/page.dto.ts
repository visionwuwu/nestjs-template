import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiStatusCode } from '../enums/api-status-code.enum';

export class PageDto {
  @IsNotEmpty({
    message: '页码不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '页码', example: 1 })
  current: number;

  @IsNotEmpty({
    message: '每页显示条数不能为空',
    context: { errorCode: ApiStatusCode.ERROR_CODE },
  })
  @ApiProperty({ title: '每页显示条数', example: 10 })
  limit: number;

  skip?: number;
}
