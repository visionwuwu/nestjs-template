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
import { CurrentUser } from 'libs/common/decorators/currentUser.decorator';
import { Logicals } from 'libs/common/decorators/logical.decorator';
import { Page } from 'libs/common/decorators/page.decorator';
import { Permissions } from 'libs/common/decorators/permissions.decorator';
import { PageDto } from 'libs/common/dtos/page.dto';
import { PermissionUrl } from 'libs/common/enums/permission-url.enum';
import { ApiException } from 'libs/common/exceptions/ApiException';
import { PermissionsGuard } from 'libs/common/guards/permission.guard';
import { DataScopeService } from 'libs/common/providers/dataScope.service';
import { UserInfo } from '../utils/user';
import { DepartmentsService } from './departments.service';
import { CreateDeptDto } from './dtos/create-dept-dto';
import { DeptListQueryDto } from './dtos/dept-query-list.dto';

@Controller('/system/dept')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('部门相关接口')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly dataScopeService: DataScopeService,
  ) {}

  /** 部门列表 */
  @Get('/list')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_DEPARTMENT_LIST])
  @Logicals()
  @ApiOperation({ summary: '系统部门列表' })
  async queryDeptList(
    @Query() query: DeptListQueryDto,
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
    return await this.departmentsService.queryDeptList(query, page, sql);
  }

  /** 当前用户拥有的部门树 */
  @Get('/ownDeptTree')
  @ApiOperation({ summary: '当前用户拥有的部门树' })
  async queryUserOwnDeptTree(@CurrentUser() user: UserInfo) {
    /** 数据筛选sql */
    const sql = await this.dataScopeService.dataFilter({
      subDept: true,
      hasUser: true,
      user,
    });
    if (sql instanceof ApiException) {
      throw sql;
    }
    return await this.departmentsService.queryUserOwnDeptTree(sql);
  }

  /** 选择部门下拉列表(修改) */
  @Get('/select/:id')
  @ApiOperation({ summary: '选择部门下拉列表' })
  async queryDeptSelect(
    @Param('id') id: string,
    @CurrentUser() user: UserInfo,
  ) {
    const sql = await this.dataScopeService.dataFilter({
      subDept: true,
      hasUser: true,
      user,
    });
    return await this.departmentsService.queryDeptSelect(id, sql);
  }

  /** 加载对应角色部门列表树 */
  @Get('/roleDeptTree/:id')
  @ApiOperation({ summary: '加载对应角色部门列表树' })
  async queryRoleDeptTreeSelect(
    @Param('id') id: string,
    @CurrentUser() user: UserInfo,
  ) {
    const sql = await this.dataScopeService.dataFilter({
      subDept: true,
      hasUser: true,
      user,
    });
    return await this.departmentsService.queryRoleDeptTreeSelect(id, sql);
  }

  /** 部门详细信息 */
  @Get('/info/:id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_DEPARTMENT_QUERY])
  @Logicals()
  @ApiOperation({ summary: '部门详细信息' })
  async queryDeptInfo(@Param('id') id: string) {
    return await this.departmentsService.queryDeptInfo(id);
  }

  /** 添加部门 */
  @Post('/add')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_DEPARTMENT_ADD])
  @Logicals()
  @ApiOperation({ summary: '添加部门' })
  async addDept(@Body() dept: CreateDeptDto) {
    return await this.departmentsService.addDept(dept);
  }

  /** 修改部门信息 */
  @Put('/:id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_DEPARTMENT_UPDATE])
  @Logicals()
  @ApiOperation({ summary: '修改部门信息' })
  async updateDept(@Param('id') id: string, @Body() dept: CreateDeptDto) {
    return await this.departmentsService.updateDept(id, dept);
  }

  /** 删除部门 */
  @Delete('/:id')
  @UseGuards(PermissionsGuard)
  @Permissions([PermissionUrl.SYSTEM_DEPARTMENT_REMOVE])
  @Logicals()
  @ApiOperation({ summary: '删除部门' })
  async removeDept(@Param('id') id: string) {
    return await this.departmentsService.removeDept(id);
  }

  /** 获取子部门 */
  @Get('/subDept/:id')
  @ApiOperation({ summary: '获取子部门' })
  async querySubDeptById(@Param('id') id: string) {
    return await this.departmentsService.getSubDeptIdList(id);
  }
}
