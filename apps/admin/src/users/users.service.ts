import { HttpStatus, Injectable } from '@nestjs/common';
import { PageDto } from 'libs/common/dtos/page.dto';
import {
  User,
  UserDocumentType,
  UserModelType,
  UserType,
} from 'libs/db/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '../users/dtos/update-user.dto';
import { RegisterDto } from './dtos/register.dto';
import { UserRole, UserRoleModelType } from 'libs/db/models/user-role.model';
import { generatorUserInfo, UserInfo } from '../utils/user';
import AjaxResult from 'libs/common/utils/AjaxResult';
import { ApiException } from 'libs/common/exceptions/ApiException';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import {
  Role,
  RoleDocumentType,
  RoleModelType,
} from 'libs/db/models/role.model';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserListQueryDto } from './dtos/user-list-query.dto';
import { handle$andArguments } from '../utils/mongodb-query';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { MenuType } from 'libs/db/models/menu.model';
import { DataScopeService } from 'libs/common/providers/dataScope.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: UserModelType,
    @InjectModel(Role) private readonly roleModel: RoleModelType,
    @InjectModel(UserRole) private readonly userRoleModel: UserRoleModelType,
    private readonly jwtService: JwtService,
    private readonly dataScopeService: DataScopeService,
  ) {}

  /** 用户登录 */
  async login(user: UserDocumentType) {
    const { password, ...restUser } = user;
    return new AjaxResult({
      code: ApiStatusCode.OK,
      data: {
        token: this.jwtService.sign(String(user._id)),
        userInfo: restUser,
      },
    });
  }

  /** 用户注册 */
  async register(dto: RegisterDto) {
    const user = {
      type: UserType.common,
      ...dto,
    };
    /** 用户名是否已存在 */
    const isUnique = await this.checkUsernameUnique(user.username);
    if (typeof isUnique === 'object') return isUnique;

    let role: RoleDocumentType;
    /** 添加一个公共角色 */
    try {
      role = await this.roleModel.findOne({ name: 'common' });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      /** 创建一个用户 */
      await this.userModel.create({ ...user });
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '注册成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 添加用户 */
  async addUser(dto: CreateUserDto) {
    const user = {
      type: UserType.common,
      ...dto,
    };
    try {
      console.log(user);
      /** 用户名已存在 */
      const isUnique = await this.checkUsernameUnique(user.username);
      if (typeof isUnique === 'object') return isUnique;

      /** 解决当deptId为空字符串时 mongodb报ObjectId错误 */
      if (!user.deptId) {
        delete user.deptId;
      }
      /** mongodb创建用户文档 */
      await this.userModel.create(user as any);

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '添加用户成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 更新当前用户信息 */
  async updateCurrentUser(user: UserDocumentType, dto: UpdateUserDto) {
    try {
      /** 根据用户名查询 */
      const userDocument = await this.userModel.findOne({
        username: user.username,
      });

      /** 用户名已存在 */
      if (userDocument) {
        return new AjaxResult({
          code: ApiStatusCode.USERNAME_UNIQUE,
          message: '用户名已存在',
        });
      }
      /** 更新当前用户信息 */
      const currentUser = await this.updateUser(user._id, dto);
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '更新成功',
        data: currentUser,
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 查找当前用户 */
  async findCurrentUser(id: string) {
    try {
      const user = await this.userModel
        .findById(id)
        .populate({
          path: 'roleIdList',
          populate: {
            path: 'menuIdList',
            match: { $or: [{ type: MenuType.B }, { type: MenuType.C }] },
          },
        })
        .lean();

      /**生成用户信息 */
      const userInfo = generatorUserInfo(user);

      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: 'success',
        data: {
          ...userInfo,
        },
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 分页查找所有用户 */
  async findUserList(queryParams: UserListQueryDto, page: PageDto, sql?: any) {
    try {
      const { pageNumber, pageSize, deptId, ...restProps } = queryParams;

      /** 分页参数 */
      const { skip, limit, current } = page;

      /** 构建mongodb $and 条件参数 */
      const $addConditions = handle$andArguments(restProps);

      console.log($addConditions);

      if (deptId) {
        $addConditions.push({ deptId: deptId });
      }

      const filterQuery =
        $addConditions.length > 0
          ? {
              $and: $addConditions,
            }
          : {};

      /** 文档总数 */
      const count = await this.userModel
        .find(filterQuery)
        .find(sql ? sql : {})
        .countDocuments();

      // $and 与 条件查询
      const data = await this.userModel
        .find(filterQuery)
        .limit(limit)
        .skip(skip)
        .find(sql ? sql : {});

      const result = {
        code: ApiStatusCode.OK,
        message: 'success',
        data: data,
        total: count,
        pageNumber: current,
      };
      return new AjaxResult(result);
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 根据用户id查找用户 */
  async findUserById(id: string) {
    try {
      const data = await this.userModel.findById(id).lean();
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: 'success',
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

  /** 更新用户 */
  async updateUser(id: string, user: UpdateUserDto) {
    try {
      /** 不允许操作admin */
      await this.checkUserAllowed(user);

      /** 根据用户名查询 */
      const userDocument = await this.userModel
        .findOne({
          username: user.username,
        })
        .lean();

      /** 用户名已存在 */
      if (userDocument && userDocument._id != id) {
        return new AjaxResult({
          code: ApiStatusCode.USERNAME_UNIQUE,
          message: '用户名已存在',
        });
      }
      /** 更新用户 */
      await this.userModel.findByIdAndUpdate(id, user);
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '更新用户成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 删除用户 */
  async removeUser(id: string) {
    try {
      await this.userModel.findByIdAndDelete(id);
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: 'success',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 修改用户状态 */
  async updateUserStatus(user: UpdateUserStatusDto) {
    try {
      /** 不允许操作admin */
      await this.checkUserAllowed(user);

      await this.userModel.findOneAndUpdate(
        { _id: user.id },
        { status: user.status },
      );
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

  /** 重置密码 */
  async resetPassword(dto: ResetPasswordDto) {
    try {
      /** 不允许操作admin */
      await this.checkUserAllowed(dto);

      await this.userModel.findByIdAndUpdate(dto.id, {
        password: dto.password,
      });
      return new AjaxResult({
        code: ApiStatusCode.OK,
        message: '重置密码成功',
      });
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 根据名称查找用户 */
  async findUserByName(username: string) {
    try {
      const user = await this.userModel
        .findOne({ username })
        .select('+password')
        .populate({
          path: 'roleIdList',
          populate: {
            path: 'menuIdList',
            match: { $or: [{ type: MenuType.B }, { type: MenuType.C }] },
          },
        })
        .lean();

      /** 用户不存在 */
      if (!user) return user;

      /** 用户存在 */
      const userInfo = generatorUserInfo(user);

      return { ...userInfo } as UserInfo;
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 用户角色表关联接口 */
  async createUserRole(userId, roleIdList) {
    try {
      const userRoles = roleIdList
        .map((roleId) => {
          if (!roleId) return null;
          return {
            user_id: userId,
            role_id: roleId,
          };
        })
        .filter((item) => !!item);
      await this.userRoleModel.insertMany(userRoles);
    } catch (error) {
      throw new ApiException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 用户名是否唯一 */
  async checkUsernameUnique(username: string) {
    const user = await this.userModel.findOne({ username });
    if (user) {
      return new AjaxResult({
        code: ApiStatusCode.USERNAME_UNIQUE,
        message: '此用户名已被使用',
      });
    }
    return false;
  }

  /** 检验是否允许用户操作 */
  async checkUserAllowed(user: any) {
    try {
      if (user && user.type === UserType.admin) {
        throw new AjaxResult({
          code: ApiStatusCode.NOT_ADMIN,
          message: '不允许操作超级管理员用户',
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
}
