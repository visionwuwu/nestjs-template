import { HttpStatus, Injectable } from '@nestjs/common';
import { PageDto } from 'libs/common/dtos/page.dto';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { ApiException } from 'libs/common/exceptions/ApiException';
import AjaxResult from 'libs/common/utils/AjaxResult';
import {
  Department,
  DepartmentModelType,
} from 'libs/db/models/department.model';
import { InjectModel } from 'nestjs-typegoose';
import { treeDataTranslate } from '../utils/menu';
import { CreateDeptDto } from './dtos/create-dept-dto';
import { DeptListQueryDto } from './dtos/dept-query-list.dto';
import { UpdateDeptDto } from './dtos/update-dept-dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: DepartmentModelType,
  ) {}

  /** 部门列表 */
  async queryDeptList(query: DeptListQueryDto, page: PageDto, sql: any) {
    try {
      const { status, name } = query;

      // const { skip, limit } = page;

      const deptList = await this.departmentModel
        .find({
          $and: [
            status ? { status: parseInt(status as any) } : {},
            name ? { name: new RegExp(`${name}.*`, 'gim') } : {},
          ],
        })
        .sort({ orderId: 1 })
        .find(sql ? sql : {});

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data: deptList,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 当前用户拥有的部门树 */
  async queryUserOwnDeptTree(sql: any) {
    try {
      const deptList = await this.departmentModel
        .find(sql)
        .sort({ orderId: 1 });

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data: deptList,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 选择部门下拉列表 */
  async queryDeptSelect(id: string, sql?: any) {
    try {
      let deptList: any[] = [{ _id: '0', name: '顶级菜单' }];

      const deptDoc = await this.departmentModel.findById(id);

      /** 部门id为零，不查询 */
      if (deptDoc.parentId !== '0') {
        const subDeptIdList = await this.getSubDeptIdList(id);
        deptList = await this.departmentModel
          .find({
            _id: { $nin: [...subDeptIdList, id] },
          })
          .find(sql ? sql : {})
          .sort({ orderId: 1 });
      }

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '获取成功',
        data: deptList,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async queryRoleDeptTreeSelect(id: string, sql?: any) {
    try {
      const data = await this.departmentModel.find(sql);
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

  /** 部门详细信息 */
  async queryDeptInfo(id: string) {
    try {
      const data = await this.departmentModel.findById(id);

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

  /** 添加部门 */
  async addDept(dept: CreateDeptDto) {
    try {
      await this.checkDeptNameUnique(dept);

      await this.departmentModel.create(dept);

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '创建成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 修改部门 */
  async updateDept(id: string, dept: UpdateDeptDto) {
    try {
      /** 部门名称不能重复 */
      await this.checkDeptNameUnique(dept, id);

      const data = await this.departmentModel.findByIdAndUpdate(id, {
        ...dept,
      });

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '更新成功',
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

  /** 删除部门 */
  async removeDept(id: string) {
    try {
      /** 请先删除子部门 */
      const children = await this.getChildById(id);
      if (children && children.length > 0) {
        throw new AjaxResult({
          code: ApiStatusCode.BAD_REQUEST,
          message: '请先删除子部门',
        });
      }

      const data = await this.departmentModel.findByIdAndRemove(id);

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '删除成功',
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

  /** 根据部门id获取直接子部门 */
  async getChildById(parentId: string) {
    try {
      const children = await this.departmentModel.find({ parentId });
      return children;
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 根据部门id获取后代部门id列表 */
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

  /** 校验部门名称是否唯一 */
  async checkDeptNameUnique(dept: UpdateDeptDto | CreateDeptDto, id?: string) {
    /** 部门名称已存在 */
    if (dept.name) {
      const deptDoc = await this.departmentModel.findOne({
        parentId: dept.parentId,
        name: dept.name,
      });
      const e = new ApiException(
        '部门名称已存在',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );

      /** 更新重复 */
      if (id && deptDoc._id != id) {
        throw e;
      }

      /** 添加重复 */
      if (!id && deptDoc) {
        throw e;
      }
    }
  }
}
