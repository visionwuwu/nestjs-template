import { ApiProperty } from '@nestjs/swagger';
import {
  prop,
  DocumentType,
  modelOptions,
  arrayProp,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Department } from './department.model';
import { Menu } from './menu.model';
import { User } from './user.model';

/** 角色mongoose文档类型 */
export type RoleDocumentType = DocumentType<Role>;

/** 角色模型类型 */
export type RoleModelType = ReturnModelType<typeof Role>;

/** 角色状态 */
export enum RoleStatus {
  /** 禁用 */
  disable = 0,
  /** 启用 */
  enable = 1,
}

/** 角色类型 */
export enum RoleType {
  /** 普通角色 */
  common = 0,
  /** 超级管理员角色 */
  admin = 1,
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
})
export class Role {
  @prop({
    required: false,
    default: 0,
    enum: RoleType,
  })
  @ApiProperty({ title: '角色类型', example: '0 普通角色 1 超级管理员角色' })
  type?: RoleType;

  @prop({
    maxlength: 20,
    required: true,
    unique: true,
    default: '',
  })
  @ApiProperty({ title: '角色名', example: 'admin' })
  name!: string;

  @prop({
    unique: true,
    default: '',
  })
  @ApiProperty({ title: '权限标识', example: 'admin' })
  roleKey?: string;

  @arrayProp({
    ref: 'Menu',
    default: [],
  })
  @ApiProperty({ title: '角色拥有菜单权限', example: [] })
  menuIdList?: Menu[];

  @arrayProp({
    ref: 'Department',
    default: [],
  })
  @ApiProperty({ title: '拥有部门', example: [] })
  deptId?: Department[];

  @prop({
    unique: true,
    required: true,
    min: 0,
    default: 0,
  })
  @ApiProperty({ title: '角色显示顺序', example: 0 })
  orderId?: number;

  @prop({
    default: 1,
  })
  @ApiProperty({ title: '角色状态', example: '0 禁用 1 启用' })
  status?: RoleStatus;

  @prop({
    maxlength: 100,
    default: '',
  })
  @ApiProperty({ title: '角色描述', example: '超级管理员' })
  remark?: string;

  @arrayProp({
    ref: 'User',
    localField: '_id',
    foreignField: 'roleIdList',
    justOne: false,
    get: (userId) => {
      if (Array.isArray(userId)) {
        userId = userId.map((val) => val._id);
      }
      return userId;
    },
  })
  userId?: User[];
}
