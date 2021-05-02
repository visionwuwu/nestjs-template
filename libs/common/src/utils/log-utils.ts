/**
 * 准备以后处理日志文件
 * @param msg 日志信息
 * @returns
 */
export function logUtils(msg: string): string {
  if (!msg) {
    msg = '';
  }
  return '[' + msg.toString() + ']';
}
