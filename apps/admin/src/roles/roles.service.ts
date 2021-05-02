import { HttpStatus, Injectable } from '@nestjs/common';
import { PageDto } from 'libs/common/dtos/page.dto';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { ApiException } from 'libs/common/exceptions/ApiException';
import AjaxResult from 'libs/common/utils/AjaxResult';
import { Role, RoleModelType, RoleType } from 'libs/db/models/role.model';
import { RoleMenu, RoleMenuModelType } from 'libs/db/models/role-menu.model';
import { UserDocumentType, UserType } from 'libs/db/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { handle$andArguments } from '../utils/mongodb-query';
import { CreateRoleDto } from './dtos/create-role.dto';
import { DataScopeDto } from './dtos/data-scope-dto';
import { RoleListQueryDto } from './dtos/role-list-query.dto';
import { UpdateRoleStatusDto } from './dtos/update-role-status.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { UserRole, UserRoleModelType } from 'libs/db/models/user-role.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleModel: RoleModelType,
    @InjectModel(RoleMenu) private readonly roleMenuModel: RoleMenuModelType,
    @InjectModel(UserRole) private readonly userRoleModel: UserRoleModelType,
  ) {}

  /** 查找角色列表 */
  async findRoleList(queryParams: RoleListQueryDto, page: PageDto, sql?: any) {
    try {
      const { pageNumber, pageSize, ...restProps } = queryParams;

      /** 分页参数 */
      const { skip, current, limit } = page;

      Object.keys(restProps).forEach((key) => {
        const val = restProps[key];
        if (!val) {
          return delete restProps[key];
        }
        if (key === 'status') {
          restProps[key] = parseInt(val);
        } else {
          restProps[key] = val;
        }
      });

      /** 构建mongodb $and 条件参数 */
      const $addConditions = handle$andArguments(restProps);

      const filterQuery =
        $addConditions.length > 0
          ? {
              $and: $addConditions,
            }
          : {};

      /** 文档总数 */
      const count = await this.roleModel
        .find(filterQuery)
        .find(sql ? sql : {})
        .countDocuments();

      console.log($addConditions, 'addConditions');

      /** 列表查询 */
      const data = await this.roleModel.aggregate([
        { $match: filterQuery },
        {
          // 关联查询
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'roleIdList',
            as: 'userId',
          },
        },
        {
          // 修改字段只需5条
          $addFields: {
            userId: '$userId._id',
          },
        },
        { $skip: skip },
        { $limit: limit },
        { $sort: { orderId: 1 } },
        { $match: sql ? sql : {} },
      ]);

      // .find(filterQuery) // $and 与 条件查询
      // .populate({
      //   path: 'userId',
      //   select: { _id: 1 },
      //   $addFields: 'userId',
      // })
      // .skip(skip)
      // .limit(limit)
      // .find(sql ? sql : {})
      // .sort({ orderId: '1' });
      /** 返回响应数据 */
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data,
        total: count,
        pageNumber: current,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }

  /** 查找角色选择框列表 */
  async findAllRole(user: UserDocumentType) {
    try {
      /** 管理员获取所有的角色 */
      const filterQuery =
        user.type === UserType.admin
          ? {}
          : {
              $where: `this.type !== ${UserType.admin}`,
            };
      const data = await this.roleModel.find(filterQuery);
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data,
      });
    } catch (error) {
      return new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 添加一个角色 */
  async addRole(role: CreateRoleDto) {
    try {
      /** 角色名不能重复 */
      const roleNameIsUnique = await this.checkRoleNameUnique(role.name);
      if (typeof roleNameIsUnique === 'object') return roleNameIsUnique;

      /** 权限标识不能重复 */
      const roleKeyIsUnique = await this.checkRoleKeyUnique(role.roleKey);
      if (typeof roleKeyIsUnique === 'object') return roleKeyIsUnique;

      /** 在mongodb集合中创建一个角色文档 */
      await this.roleModel.create(role);

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '添加成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }

  /** 角色数据授权 */
  async dataScope(dataScope: DataScopeDto) {
    try {
      await this.roleModel.findByIdAndUpdate(dataScope.id, {
        deptIds: dataScope.deptIds,
      });
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '数据授权成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }

  /** 根据id查找角色 */
  async findRoleById(id: string) {
    try {
      const role = await this.roleModel.findById(id);
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data: role,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }

  /** 根据id更新角色 */
  async updateRoleById(id: string, role: UpdateRoleDto) {
    try {
      /** 检验是否允许操作 */
      await this.checkRoleAllowed(role);

      /** 角色名不能重复 */
      const roleNameIsUnique = await this.checkRoleNameUnique(role.name, id);
      if (typeof roleNameIsUnique === 'object') return roleNameIsUnique;

      /** 权限标识不能重复 */
      const roleKeyIsUnique = await this.checkRoleKeyUnique(role.roleKey, id);
      if (typeof roleKeyIsUnique === 'object') return roleKeyIsUnique;

      /** 更新角色文档 */
      await this.roleModel.findByIdAndUpdate(id, role);

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '更新成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }

  /** 根据id删除角色 */
  async removeRole(ids: string) {
    try {
      const idsArr = ids.split(',');
      await this.roleModel.deleteMany({
        _id: { $in: idsArr },
      });
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '删除成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }

  /** 更新角色状态 */
  async updateRoleStatus(dto: UpdateRoleStatusDto) {
    try {
      /** 检验是否允许操作 */
      await this.checkRoleAllowed(dto);

      await this.roleModel.findOneAndUpdate(
        { _id: dto.id },
        { status: dto.status },
      );
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '更新成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }

  /** 检验角色权限标识是否唯一 */
  async checkRoleKeyUnique(roleKey: string, id?: string) {
    try {
      const role = await this.roleModel.findOne({ roleKey });
      if (role) {
        if (id && role._id == id) return false;
        return new AjaxResult({
          code: ApiStatusCode.ERROR_CODE,
          message: '权限标识已存在',
        });
      }
      return false;
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }

  /** 检验角色名是否唯一 */
  async checkRoleNameUnique(rolename: string, id?: string) {
    try {
      const role = await this.roleModel.findOne({ name: rolename });
      if (role) {
        /** 含有id则为更新检查，否则就是添加检查 */
        if (id && role._id == id) return false;
        return new AjaxResult({
          code: ApiStatusCode.ERROR_CODE,
          message: '角色名已存在',
        });
      }
      return false;
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }

  /** 检验是否允许角色操作 */
  async checkRoleAllowed(role: any) {
    try {
      if (role && role.type === RoleType.admin) {
        throw new AjaxResult({
          code: ApiStatusCode.NOT_ADMIN,
          message: '不允许操作超级管理员角色',
        });
      }
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 创建角色菜单关联记录 */
  async createRoleMenu(roleId, menuIdList) {
    try {
      const roleMenus = menuIdList
        .map((menuId) => {
          if (!menuId) return null;
          return {
            role_id: roleId,
            menu_id: menuId,
          };
        })
        .filter((item) => !!item);
      await this.roleMenuModel.insertMany(roleMenus);
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.ERROR_CODE,
      );
    }
  }
}
