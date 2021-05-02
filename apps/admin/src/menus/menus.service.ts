import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { ApiException } from 'libs/common/exceptions/ApiException';
import AjaxResult from 'libs/common/utils/AjaxResult';
import {
  Menu,
  MenuModelType,
  MenuStatus,
  MenuType,
} from 'libs/db/models/menu.model';
import { Role, RoleModelType } from 'libs/db/models/role.model';
import { UserDocumentType, UserType } from 'libs/db/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { treeDataTranslate } from '../utils/menu';
import { handle$andArguments } from '../utils/mongodb-query';
import { getMenusInRoles } from '../utils/user';
import { CreateMenuDto } from './dtos/create-menu.dto';
import { MenuListQueryDto } from './dtos/menu-list-query.dto';
import { UpdateMenuDto } from './dtos/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu) private readonly menuModel: MenuModelType,
    @InjectModel(Role) private readonly roleModel: RoleModelType,
  ) {}

  /** 查找所有菜单 */
  async findMenuList(queryParams: MenuListQueryDto, user: any) {
    try {
      let data: any[] = [];
      Object.keys(queryParams).forEach((key) => {
        const val = queryParams[key];
        if (val === undefined || val === null || val === '') {
          return delete queryParams[key];
        }
        if (key === 'status') {
          queryParams[key] = parseInt(val);
        } else {
          queryParams[key] = val;
        }
      });

      /** 构建mongodb $and 条件参数 */
      const $addConditions = handle$andArguments(queryParams);

      const filterQuery =
        $addConditions.length > 0
          ? {
              $and: $addConditions,
            }
          : {};

      /** 管理员获取所有菜单 */
      if (user.type === UserType.admin) {
        data = await this.menuModel.find(filterQuery).sort({ orderId: '1' });
      } else {
        // 获取当前用户所拥有的菜单
        const roles = await this.roleModel
          .find({
            _id: { $in: user.roleIdList },
          })
          .populate({
            path: 'menuIdList',
            match: {
              $nor: [{ type: MenuType.B }, { status: MenuStatus.disable }],
              ...filterQuery,
            },
          })
          .sort({ orderId: '1' });
        data = getMenusInRoles(roles);
      }
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 添加一个菜单 */
  async addMenu(menu: CreateMenuDto) {
    try {
      /** 检验添加的菜单位置是否正确 */
      await this.verifyParams(menu);

      /** 创建菜单 */
      await this.menuModel.create(menu);

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '添加成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 根据id查找菜单信息 */
  async findMenuById(id: string) {
    try {
      const data = await this.menuModel.findById(id);
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 根据id更新菜单 */
  async updateMenuById(id: string, menu: UpdateMenuDto) {
    try {
      /** 检验添加的菜单位置是否正确 */
      await this.verifyParams(menu, id);

      /** 更新菜单 */
      await this.menuModel.findByIdAndUpdate(id, menu);

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '更新成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 根据id删除菜单 */
  async removeMenuById(id: string) {
    try {
      /** 判断是否有子菜单或按钮 */
      const menuList = await this.findListByParentId(id);

      if (menuList.length > 0) {
        return new AjaxResult({
          code: ApiStatusCode.BAD_REQUEST,
          message: '请先删除子菜单或按钮',
        });
      }

      /** 删除菜单 */
      await this.menuModel.findByIdAndDelete(id);

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '删除成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 获取用户拥有的菜单，路由 */
  async getRoutes(user) {
    try {
      /** 用户类型 */
      const type = user.type;
      const roleIdList = user.roleIdList;
      let data = [];
      /** 管理员获取所有菜单 */
      if (type === UserType.admin) {
        data = await this.menuModel
          .find({
            $nor: [{ type: MenuType.B }, { status: MenuStatus.disable }],
            _id: { $ne: '607c2b28b05f3a12d15f0d89' },
          })
          .sort({ orderId: '1' });
      } else {
        const roles = await this.roleModel
          .find({
            _id: { $in: roleIdList },
          })
          .populate({
            path: 'menuIdList',
            match: {
              $nor: [{ type: MenuType.B }, { status: MenuStatus.disable }],
            },
          })
          .sort({ orderId: '1' });
        data = getMenusInRoles(roles);
      }
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 获取菜单树包含按钮 */
  async getMenuTree() {
    try {
      const data = await this.menuModel.find().lean();
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 获取下拉菜单树 不包含按钮 */
  async findTreeSelect() {
    try {
      const data = await this.menuModel
        .find({
          $and: [
            { $where: `this.type !== ${MenuType.B}` },
            { $where: 'this.parentId === "0"' },
          ],
        })
        .populate('children');

      /** 添加顶级菜单，parentId为0的父级菜单 */
      const treeMenu = [
        {
          key: '主类目',
          _id: '0',
          children: data,
        },
      ];
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '查询成功',
        data: treeMenu,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 获取角色对应的菜单树 */
  async findRoleMenuTreeSelect(user: any) {
    try {
      let data: any[] = [];
      if (user.type === UserType.admin) {
        data = await this.menuModel
          .find({ $where: 'this.parentId === "0"' })
          .populate('children');
      } else {
        const roles = await this.roleModel
          .find({
            _id: { $in: user.roleIdList },
          })
          .populate({
            path: 'menuIdList',
            match: {
              $nor: [{ type: MenuType.B }, { status: MenuStatus.disable }],
            },
          });
        data = getMenusInRoles(roles);
        data = treeDataTranslate(data, '_id', 'parentId');
      }
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 根据父级菜单id查找子菜单 */
  async findListByParentId(parentId: string) {
    try {
      const menuList = await this.menuModel.find({ parentId });
      return menuList;
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 获取当前用户拥有的菜单 */

  /** 验证(添加、更新)参数是否正确 */
  async verifyParams(menu: CreateMenuDto | UpdateMenuDto, id?: string) {
    /** 检验菜单路径是否唯一 */
    if (menu.type === MenuType.M || menu.type === MenuType.C) {
      const menuDoc = await this.menuModel.findOne({ path: menu.path });
      const e = new ApiException(
        '菜单路径已存在',
        HttpStatus.BAD_REQUEST,
        ApiStatusCode.BAD_REQUEST,
      );
      /** 添加校验 */
      if (!id && menuDoc) {
        throw e;
      }
      /** 更新校验 */
      if (id && menuDoc._id != id) {
        throw e;
      }
    }

    /** 检验菜单权限是否唯一 */
    if (menu.type === MenuType.C || menu.type === MenuType.B) {
      const menuDoc = await this.menuModel.findOne({ perms: menu.perms });
      const e = new ApiException(
        '菜单权限已存在',
        HttpStatus.BAD_REQUEST,
        ApiStatusCode.BAD_REQUEST,
      );
      /** 添加校验 */
      if (!id && menuDoc) {
        throw e;
      }
      /** 更新校验 */
      if (id && menuDoc._id != id) {
        throw e;
      }
    }

    /** 上级菜单为0 */
    if (menu.type === MenuType.M || menu.type === MenuType.C) {
      if (menu.parentId === '0') {
        return;
      }
    }

    /** 目录，菜单上级菜单只能为目录类型 */
    if (menu.type === MenuType.M || menu.type === MenuType.C) {
      const parentMenu = await this.menuModel.findOne({
        _id: menu.parentId,
      });
      if (parentMenu.type !== MenuType.M) {
        throw new ApiException(
          '上级菜单只能为目录类型',
          HttpStatus.BAD_REQUEST,
          ApiStatusCode.BAD_REQUEST,
        );
      }
    }

    /** 按钮类型的菜单上级菜单只能是菜单类型 */
    if (menu.type === MenuType.B) {
      const parentMenu = await this.menuModel.findOne({
        _id: menu.parentId,
      });
      if (parentMenu.type !== MenuType.C) {
        throw new ApiException(
          '上级菜单只能为菜单类型',
          HttpStatus.BAD_REQUEST,
          ApiStatusCode.BAD_REQUEST,
        );
      }
    }
  }
}
