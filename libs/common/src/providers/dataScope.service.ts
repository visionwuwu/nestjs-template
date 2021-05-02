import { HttpStatus, Injectable } from '@nestjs/common';
import { UserInfo } from 'apps/admin/src/utils/user';
import {
  Department,
  DepartmentModelType,
} from 'libs/db/models/department.model';
import { User, UserModelType, UserType } from 'libs/db/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ApiStatusCode } from '../enums/api-status-code.enum';
import { ApiException } from '../exceptions/ApiException';

export interface DataFilterOptions {
  /** true：拥有子部门数据权限 */
  subDept?: boolean;
  /**  true：没有本部门数据权限，也能查询本人数据 */
  hasUser?: boolean;
  /**  表名 */
  tableName?: string;
  /** 用户信息 */
  user?: UserInfo;
}

@Injectable()
export class DataScopeService {
  /** 部门id */
  private readonly deptId: string = 'deptId';
  /** 用户id */
  private readonly userId: string = 'userId';
  /** true：拥有子部门数据权限 */
  private subDept = false;
  /**  true：没有本部门数据权限，也能查询本人数据 */
  private hasUser = false;
  /**  表名 */
  private tableName = '';

  constructor(
    @InjectModel(Department)
    private readonly departmentModel: DepartmentModelType,
    @InjectModel(User) private readonly userModel: UserModelType,
  ) {}

  /** 过滤数据 */
  async dataFilter(
    options: DataFilterOptions = {
      subDept: true,
      hasUser: false,
      tableName: '',
      user: null,
    },
  ) {
    const { subDept, hasUser, tableName, user } = options;
    if (!user) {
      throw new ApiException(
        '用户不存在',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    /** 超级管理员无需数据过滤，直接获取所有数据 */
    if (user.type === UserType.admin) {
      return {};
    }
    // console.log(subDept, user);
    const sql = await this.getSQLFilter(subDept, hasUser, user);
    return sql;
  }

  /** 获取过滤的sql */
  async getSQLFilter(subDept: boolean, hasUser: boolean, user: UserInfo) {
    /** 部门id数组 */
    let deptIdList: string[] = [];

    /** 用户拥有的部门id */
    if (user.deptId) {
      deptIdList.push(user.deptId as any);
    }

    /** 用户角色对应的部门id列表 */
    const roles = user.roles;
    if (roles && roles.length > 0) {
      roles.forEach((role) => {
        if (role.deptId && role.deptId.length > 0) {
          deptIdList = deptIdList.concat(role.deptId as any);
        }
      });
    }

    /** 用户子部门列表id */
    if (subDept) {
      const subDeptIdList = await this.getSubDeptIdList(user.deptId as string);
      if (subDeptIdList && subDeptIdList.length > 0) {
        subDeptIdList.forEach((id) => deptIdList.push(id));
      }
    }

    /** 构建数据过滤sql */
    const sql = { $or: [] } as { [key: string]: any };

    if (deptIdList.length > 0) {
      sql.$or.push(
        { deptId: { $in: deptIdList } },
        { _id: { $in: deptIdList } },
      );
    }

    console.log(deptIdList);

    /** 没有本部门数据，也能获取本人数据 */
    if (hasUser) {
      sql.$or.push({ _id: user._id }, { userId: { $in: [user._id] } });
    }

    /** 无数过滤条件 */
    if (sql.$or.length === 0) {
      return {};
    }

    return sql;
  }

  /** 根据部门id获取子部门id列表 */
  async getSubDeptIdList(parentId: string) {
    try {
      const deptIdList: string[] = [];
      let subDeptIdList: string[] = [];
      const deptDocs = await this.departmentModel.find(
        {
          parentId,
        },
        { id: 1 },
      );
      if (deptDocs) {
        subDeptIdList = deptDocs.map((dept) => dept._id);
      }

      await this.getDeptTreeList(deptIdList, subDeptIdList);

      return deptIdList;
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 递归获取子部门菜单 */
  async getDeptTreeList(deptIdList: string[], subDeptIdList: string[]) {
    for (let i = 0; i < subDeptIdList.length; i++) {
      const list = await this.getSubDeptIdList(subDeptIdList[i]);
      if (list && list.length > 0) {
        await this.getDeptTreeList(deptIdList, list);
      }
      deptIdList.push(subDeptIdList[i]);
    }
  }
}
