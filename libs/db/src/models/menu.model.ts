import { ApiProperty } from '@nestjs/swagger';
import {
  prop,
  DocumentType,
  modelOptions,
  ReturnModelType,
  arrayProp,
} from '@typegoose/typegoose';

/** 菜单文档类型 */
export type MenuDocumentType = DocumentType<Menu>;

/** 菜单模型类型 */
export type MenuModelType = ReturnModelType<typeof Menu>;

/** 菜单类型 */
export enum MenuType {
  /** 目录 */
  M = 2,
  /** 菜单 */
  C = 1,
  /** 按钮 */
  B = 0,
}

/** 菜单状态 */
export enum MenuStatus {
  /** 禁用 */
  disable = 0,
  /** 启用 */
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
export class Menu {
  @prop({
    required: true,
  })
  @ApiProperty({ title: '菜单名称', example: '首页' })
  name: string;

  @prop()
  @ApiProperty({ title: '菜单图标', example: 'HomeOutlined' })
  icon?: string;

  @prop()
  @ApiProperty({ title: '菜单路径', example: '/dashboard' })
  path?: string;

  @prop()
  @ApiProperty({ title: '父级菜单', example: '' })
  parentId?: string;

  @prop({
    required: true,
  })
  @ApiProperty({ title: '菜单显示顺序', example: 0 })
  orderId?: number;

  @prop()
  @ApiProperty({ title: '菜单权限标识', example: 'system:user:list' })
  perms?: string;

  @prop({
    default: 1,
  })
  @ApiProperty({ title: '菜单类型', example: '2 目录 1 菜单 0 按钮' })
  type?: MenuType;

  @prop({
    default: 1,
  })
  @ApiProperty({ title: '菜单状态', example: '0 禁用 1 启用' })
  status?: MenuStatus;

  @prop()
  @ApiProperty({ title: '菜单描述', example: '一级菜单' })
  remark?: string;

  @arrayProp({
    ref: 'Menu',
    localField: '_id',
    foreignField: 'parentId',
    justOne: false,
  })
  @ApiProperty({ title: '子菜单', example: [] })
  children?: Menu[];
}
