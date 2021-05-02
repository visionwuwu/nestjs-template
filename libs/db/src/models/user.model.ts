import { ApiProperty } from '@nestjs/swagger';
import {
  prop,
  DocumentType,
  modelOptions,
  arrayProp,
  ReturnModelType,
  mongoose,
} from '@typegoose/typegoose';
import { hashSync } from 'bcrypt';
import { Mongoose } from 'mongoose';
import { Department } from './department.model';
import { Role } from './role.model';

/** 用户文档类型 */
export type UserDocumentType = DocumentType<User>;

/** 用户模型类型 */
export type UserModelType = ReturnModelType<typeof User>;

/** 用户类型 */
export enum UserType {
  /** 普通用户 */
  common = 0,
  /** 超级管理员 */
  admin = 1,
}

/** 性别枚举 */
export enum SexEnum {
  // 男
  male = 1,
  // 女
  female = 2,
  // 未知
  unknown = 3,
}

/** 用户状态枚举 */
export enum UserStatus {
  // 禁用
  disable = 0,
  // 启用
  enable = 1,
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
})
export class User {
  @prop()
  @ApiProperty({ title: '用户类型', example: '0 普通用户 1 超级管理员' })
  type: UserType;

  @prop({
    required: true,
    unique: true,
    validate: [
      {
        validator: (v: string) => {
          return v.length <= 20;
        },
        message: '用户名长度不能超过20位',
      },
    ],
  })
  @ApiProperty({ title: '用户名', example: 'visionwuwu' })
  username?: string;

  @prop({
    select: false,
    set(val) {
      return val ? hashSync(val, 10) : val;
    },
    get(val) {
      return val;
    },
  })
  @ApiProperty({ title: '密码', example: '123456' })
  password?: string;

  @prop({
    default: '',
    validate: {
      validator: (v) => {
        return v.length <= 20;
      },
      message: '用户昵称长度不能大于20',
    },
  })
  @ApiProperty({ title: '昵称', example: '用户昵称' })
  nickname?: string;

  @prop({
    default: '',
  })
  @ApiProperty({ title: '手机号', example: '137******9894' })
  mobile?: string;

  @prop({
    default: '',
  })
  @ApiProperty({ title: '邮箱', example: '2020xxxx@qq.com' })
  email?: string;

  @prop({
    default: '',
  })
  @ApiProperty({ title: '头像', example: 'file.jpg' })
  avatar?: string;

  @prop({
    default: 3,
  })
  @ApiProperty({
    title: '性别',
    example: 1,
    description: '男性 1 女性 2 未知 3',
  })
  sex?: SexEnum;

  @arrayProp({
    ref: 'Role',
    default: [],
  })
  @ApiProperty({ title: '用户角色类型', example: 2 })
  roleIdList?: Role[];

  @prop({
    ref: 'Department',
  })
  @ApiProperty({ title: '用户所属部门', example: '研发部' })
  deptId?: Department;

  @prop({
    default: 1,
  })
  @ApiProperty({
    title: '用户状态',
    example: 1,
    description: '启用 1 禁用 0',
  })
  status?: UserStatus;

  @prop({
    ref: 'User',
  })
  @ApiProperty({
    title: '当前创建用户的Id',
    example: '',
  })
  createUserId?: string;

  @prop({
    ref: 'User',
  })
  @ApiProperty({
    title: '当前更新用户的Id',
    example: '',
  })
  updateUserId?: string;

  @prop({
    default: '',
    validate: {
      validator: (v) => {
        return v.length <= 100;
      },
      message: '用户备注字数不能超过100',
    },
  })
  @ApiProperty({
    title: '用户备注',
    example: 'this is a very good blog system',
  })
  remark?: string;
}
