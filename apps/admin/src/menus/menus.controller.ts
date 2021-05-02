import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dtos/create-menu.dto';
import { UpdateMenuDto } from './dtos/update-menu.dto';
import { PermissionsGuard } from 'libs/common/guards/permission.guard';
import { Logicals } from 'libs/common/decorators/logical.decorator';
import { Permissions } from 'libs/common/decorators/permissions.decorator';
import { CurrentUser } from 'libs/common/decorators/currentUser.decorator';
import { PermissionUrl } from 'libs/common/enums/permission-url.enum';
import { MenuListQueryDto } from './dtos/menu-list-query.dto';
import { UserDocumentType } from 'libs/db/models/user.model';

@Controller('/system/menu')
@ApiTags('菜单相关接口')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  /** 获取菜单列表 */
  @Get('list')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_MENU_LIST])
  @Logicals()
  @ApiOperation({ summary: '菜单列表' })
  async findMenuList(
    @Query() queryParams: MenuListQueryDto,
    @CurrentUser() user: UserDocumentType,
  ) {
    return await this.menusService.findMenuList(queryParams, user);
  }

  /** 获取菜单详细信息 */
  @Get('info/:id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_MENU_QUERY])
  @Logicals()
  @ApiOperation({ summary: '获取菜单详细信息' })
  async findMenuById(@Param('id') id: string) {
    return await this.menusService.findMenuById(id);
  }

  /** 获取所有路由 */
  @Get('getRoutes')
  @ApiOperation({ summary: '获取所有路由' })
  async getRoutes(@CurrentUser() user: UserDocumentType) {
    return await this.menusService.getRoutes(user);
  }

  /** 获取菜单树 */
  @Get('tree')
  @ApiOperation({ summary: '获取菜单树' })
  async getMenuTree() {
    return await this.menusService.getMenuTree();
  }

  /** 选择菜单(添加、修改菜单) */
  @Get('treeSelect')
  @ApiOperation({ summary: '获取下拉列表菜单树' })
  async getTreeSelect() {
    return await this.menusService.findTreeSelect();
  }

  /** 获取角色对应的菜单树 */
  @Get('roleMenuTreeSelect')
  @ApiOperation({ summary: '获取角色对应的菜单树  ' })
  async getRoleMenuTreeSelect(@CurrentUser() user) {
    return await this.menusService.findRoleMenuTreeSelect(user);
  }

  /** 添加菜单 */
  @Post('add')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_MENU_ADD])
  @Logicals()
  @ApiOperation({ summary: '添加菜单' })
  async addRole(@Body() dto: CreateMenuDto) {
    return await this.menusService.addMenu(dto);
  }

  /** 更新菜单 */
  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_MENU_UPDATE])
  @Logicals()
  @ApiOperation({ summary: '更新菜单' })
  async updateRole(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return await this.menusService.updateMenuById(id, dto);
  }

  /** 删除菜单 */
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_MENU_REMOVE])
  @Logicals()
  @ApiOperation({ summary: '删除菜单' })
  async removeRole(@Param('id') id: string) {
    return await this.menusService.removeMenuById(id);
  }
}
