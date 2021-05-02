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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'libs/common/decorators/currentUser.decorator';
import { Logicals } from 'libs/common/decorators/logical.decorator';
import { Page } from 'libs/common/decorators/page.decorator';
import { Permissions } from 'libs/common/decorators/permissions.decorator';
import { PageDto } from 'libs/common/dtos/page.dto';
import { PermissionUrl } from 'libs/common/enums/permission-url.enum';
import { ApiException } from 'libs/common/exceptions/ApiException';
import { PermissionsGuard } from 'libs/common/guards/permission.guard';
import { DataScopeService } from 'libs/common/providers/dataScope.service';
import { UserDocumentType } from 'libs/db/models/user.model';
import { UserInfo } from '../utils/user';
import { CreateRoleDto } from './dtos/create-role.dto';
import { DataScopeDto } from './dtos/data-scope-dto';
import { RoleListQueryDto } from './dtos/role-list-query.dto';
import { UpdateRoleStatusDto } from './dtos/update-role-status.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RolesService } from './roles.service';

@Controller('/system/role')
@ApiTags('角色相关接口')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly dataScopeService: DataScopeService,
  ) {}

  /** 获取角色列表 */
  @Get('list')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_ROLE_LIST])
  @Logicals()
  @ApiOperation({ summary: '角色列表' })
  async findAllRole(
    @Query() queryParams: RoleListQueryDto,
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
    console.log(sql);
    return await this.rolesService.findRoleList(queryParams, page, sql);
  }

  /** 获取角色选择框列表 */
  @Get('all')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_ROLE_LIST])
  @Logicals()
  @ApiOperation({ summary: '获取角色选择框列表' })
  async findOptionSelect(@CurrentUser() user: UserDocumentType) {
    return await this.rolesService.findAllRole(user);
  }

  /** 根据id查看角色详细信息 */
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_ROLE_QUERY])
  @Logicals()
  @ApiOperation({ summary: '查看角色详细信息' })
  async findRoleById(@Param('id') id: string) {
    return await this.rolesService.findRoleById(id);
  }

  /** 添加角色 */
  @Post('add')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_ROLE_ADD])
  @Logicals()
  @ApiOperation({ summary: '添加角色' })
  async addRole(@Body() dto: CreateRoleDto) {
    return await this.rolesService.addRole(dto);
  }

  /** 更新角色 */
  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_ROLE_UPDATE])
  @Logicals()
  @ApiOperation({ summary: '更新角色' })
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return await this.rolesService.updateRoleById(id, dto);
  }

  /** 更新角色状态 */
  @Patch('changeStatus')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_ROLE_UPDATE])
  @Logicals()
  @ApiOperation({ summary: '更新角色状态' })
  async changeStatus(@Body() dto: UpdateRoleStatusDto) {
    return await this.rolesService.updateRoleStatus(dto);
  }

  /** 数据授权 */
  @Patch('dataScope')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_ROLE_DATASCOPE])
  @Logicals()
  @ApiOperation({ summary: '数据授权' })
  async dataScope(@Body() dataScope: DataScopeDto) {
    return this.rolesService.dataScope(dataScope);
  }

  /** 删除角色 */
  @Delete(':ids')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_ROLE_REMOVE])
  @Logicals()
  @ApiOperation({ summary: '删除角色' })
  async removeRole(@Param('ids') ids: string) {
    return await this.rolesService.removeRole(ids);
  }
}
