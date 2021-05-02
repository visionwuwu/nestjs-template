import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Page } from 'libs/common/decorators/page.decorator';
import { PageDto } from 'libs/common/dtos/page.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from './users.service';
import { CurrentUser } from 'libs/common/decorators/currentUser.decorator';
import { UserDocumentType } from 'libs/db/models/user.model';
import { UpdateUserDto } from '../users/dtos/update-user.dto';
import { RegisterDto } from './dtos/register.dto';
import { PermissionsGuard } from 'libs/common/guards/permission.guard';
import { Permissions } from 'libs/common/decorators/permissions.decorator';
import { Logicals } from 'libs/common/decorators/logical.decorator';
import { PermissionUrl } from 'libs/common/enums/permission-url.enum';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserListQueryDto } from './dtos/user-list-query.dto';
import AjaxResult from 'libs/common/utils/AjaxResult';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { DataScopeService } from 'libs/common/providers/dataScope.service';
import { UserInfo } from '../utils/user';
import { ApiException } from 'libs/common/exceptions/ApiException';

@Controller()
@ApiTags('用户相关接口')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly dataScopeService: DataScopeService,
  ) {}

  /** 用户登录 */
  @Post('/user/login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() dto: LoginDto, @CurrentUser() user: UserDocumentType) {
    return this.userService.login(user);
  }

  /** 用户注册 */
  @Post('/user/register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() dto: RegisterDto) {
    return await this.userService.register(dto);
  }

  /** 用户登出 */
  @Post('/user/logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '用户登出' })
  async logout() {
    return new AjaxResult({
      code: ApiStatusCode.OK,
      message: 'success',
      data: true,
    });
  }

  /** 获取用户信息 */
  @Get('user/info')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取当前用户信息' })
  async currentUser(@CurrentUser(ValidationPipe) user: UserDocumentType) {
    return new AjaxResult({
      code: ApiStatusCode.OK,
      message: 'success',
      data: user,
    });
  }

  /** 更新当前用户信息 */
  @Put('user/updateInfo')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新当前用户信息' })
  async updateCurrentUser(
    @CurrentUser() user: UserDocumentType,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateCurrentUser(user, dto);
  }

  /** 获取用户列表 */
  @Get('/system/user/list')
  @UseGuards(PermissionsGuard)
  @Logicals()
  @Permissions([PermissionUrl.SYSTEM_USER_LIST])
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户列表' })
  async TableDataList(
    @Query() queryParams: UserListQueryDto,
    @Page() page: PageDto,
    @CurrentUser() user: UserInfo,
  ) {
    /** 数据筛选sql */
    const sql = await this.dataScopeService.dataFilter({
      subDept: true,
      hasUser: true,
      user,
    });
    if (sql instanceof ApiException) {
      throw sql;
    }
    return await this.userService.findUserList(queryParams, page, sql);
  }

  /** 添加用户 */
  @Post('/system/user/add')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_USER_ADD])
  @Logicals()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '添加用户' })
  @ApiBearerAuth()
  async addUser(@Body() dto: CreateUserDto) {
    return await this.userService.addUser(dto);
  }

  /** 根据id获取用户 */
  @Get('/system/user/:id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_USER_QUERY])
  @Logicals()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '根据id获取用户' })
  async findUserInfo(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  /** 根据id更新用户 */
  @Put('/system/user/:id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_USER_UPDATE])
  @Logicals()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '根据id更新用户' })
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.userService.updateUser(id, user);
  }

  /** 根据id删除用户 */
  @Delete('/system/user/:id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_USER_REMOVE])
  @Logicals()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '根据id删除用户' })
  async remove(@Param('id') id: string) {
    return await this.userService.removeUser(id);
  }

  /** 修改用户状态 */
  @Patch('system/user/changeStatus')
  @ApiOperation({ summary: '修改用户状态' })
  async changeStatus(@Body() user: UpdateUserStatusDto) {
    return await this.userService.updateUserStatus(user);
  }

  /** 重置用户密码 */
  @Patch('system/user/resetPwd')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_USER_RESETPWD])
  @Logicals()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '重置用户密码' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.userService.resetPassword(dto);
  }
}
