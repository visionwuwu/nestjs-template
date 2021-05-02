import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IResponseData } from 'libs/common/types';
import { CurrentUser } from 'libs/common/decorators/currentUser.decorator';
import { Roles } from 'libs/common/decorators/roles.decorator';
import { HttpExceptionFilter } from 'libs/common/filters/HttpException.filter';
import { RolesGuard } from 'libs/common/guards/roles.guard';
import { UserDocumentType } from 'libs/db/models/user.model';
import { ILoginResult } from './auth';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import { RegisterUserDto } from './dtos/register.dto';

@Controller('auth')
@ApiTags('Auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @UseGuards(AuthGuard('local'))
  async login(
    @Body() dto: LoginUserDto,
    @CurrentUser() user: UserDocumentType,
  ): Promise<ILoginResult> {
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() dto: RegisterUserDto): Promise<IResponseData> {
    return await this.authService.register(dto);
  }

  @Get('user')
  @UseGuards(RolesGuard)
  @Roles(['common'])
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户' })
  async currentUser(
    @CurrentUser() user: UserDocumentType,
  ): Promise<IResponseData> {
    return this.authService.currentUser(user);
  }
}
