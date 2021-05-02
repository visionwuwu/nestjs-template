/**
 * 字符串工具类
 *
 * @author Visionwuwu
 */
export default class StringUtils {
  /** 空字符串 */
  private static NULLSTR = '';

  /** 下划线 */
  private static SEPARATOR = '_';

  /** 对象原型的toString方法 */
  private static ObjPropertyToStr = Object.prototype.toString;

  /**
   * 判断值是否为null
   * @param val
   * @returns {boolean}
   */
  public static isNull(val: any): boolean {
    return val === null;
  }

  /**
   * 判断是否为普通对象
   * @param val
   */
  public static isPlainObject(val: any): boolean {
    return this.ObjPropertyToStr.call(val) === '[object Object]';
  }

  /**
   * 判断一个对象是否为空对象
   * @param object
   * @return {boolean}
   */
  public static isEmptyObject(object: any): boolean {
    return (
      this.ObjPropertyToStr.call(object) === '[object Object]' &&
      Object.keys(object).length > 0
    );
  }

  /**
   * 判断数组是否空
   * @param arr
   * @return {boolean}
   */
  public static isEmptyArray(arr: any[]): boolean {
    return Array.isArray(arr) && arr.length > 0;
  }

  /** 判断是否为undefined */
  public static isUndefined(val: any): boolean {
    return typeof val === 'undefined';
  }

  /** 判断是否为空串 */
  public static isEmpayStr(val: string): boolean {
    return val === '' && val.length === 0;
  }
}
