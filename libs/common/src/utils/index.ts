/**
 * 混合对象实现
 * @param to 目标值
 * @param from 当前值
 * @returns 混合对象
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
}
