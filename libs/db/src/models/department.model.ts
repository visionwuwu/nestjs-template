import { ApiProperty } from '@nestjs/swagger';
import {
  arrayProp,
  DocumentType,
  modelOptions,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose';

/** 部门文档类型 */
export type DepartmentDocumentType = DocumentType<Department>;

/** 部门模型类型 */
export type DepartmentModelType = ReturnModelType<typeof Department>;

/** 部门状态 */
export enum DepartmentStatus {
  /** 启用 */
  enable = 1,
  /** 禁用 */
  disable = 0,
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
})
export class Department {
  @prop({
    required: true,
  })
  @ApiProperty({ title: '部门名称', example: '乐橙公司' })
  name: string;

  @prop({ required: true })
  @ApiProperty({ title: '上级部门Id', example: '研发部' })
  parentId: string;

  @prop({
    required: true,
    min: 0,
    default: 0,
  })
  @ApiProperty({ title: '显示排序', example: 0 })
  orderId: number;

  @prop({
    default: '',
  })
  @ApiProperty({ title: '部门负责人', example: 'Visionwuwu' })
  leader?: string;

  @prop({
    default: '',
  })
  @ApiProperty({ title: '邮箱', example: '2020' })
  email?: string;

  @prop({
    default: '',
  })
  @ApiProperty({ title: '联系电话', example: '1376767**98' })
  mobile?: string;

  @prop({
    default: 1,
  })
  @ApiProperty({ title: '部门状态', example: 1 })
  status?: DepartmentStatus;

  @prop({
    ref: 'User',
    default: '',
  })
  @ApiProperty({ title: '创建用户id', example: '' })
  createUserId?: string;

  @prop({
    default: Date.now,
  })
  @ApiProperty({ title: '创建时间', example: '' })
  createTime?: Date;

  @prop({
    ref: 'User',
    default: '',
  })
  @ApiProperty({ title: '更新用户id', example: '' })
  updateUserId?: string;

  @prop({
    default: Date.now,
  })
  @ApiProperty({ title: '更新时间', example: '' })
  updateTime?: Date;

  @arrayProp({
    ref: 'Department',
    localField: '_id',
    foreignField: 'parentId',
    justOne: false,
  })
  @ApiProperty({ title: '子部门', example: [] })
  children?: Department[];
}
