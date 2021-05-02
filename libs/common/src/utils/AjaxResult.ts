import { ApiStatusCode } from '../enums/api-status-code.enum';
import { extend } from './index';

/** Ajax响应提示信息 */
export const messageMap = {
  INSERT_MSG: '添加成功',
  UPDATE_MSG: '更新成功',
  FIND_MSG: '查询成功',
  DELETE_MSG: '删除成功',
};

/** http响应数据类型 */
export interface IAjaxResultOpt<T = any> {
  code: ApiStatusCode;
  message?: string;
  data?: T;
  total?: number;
  pageNumber?: number;
  [prop: string]: any;
}

/**
 * Ajax请求响应的数据
 *
 * @author Visionwuwu
 */
export default class AjaxResult<T = any> {
  public message: string;
  public code: ApiStatusCode;
  public data: T;

  constructor(options: IAjaxResultOpt<T>) {
    extend(this, options);
  }
}
