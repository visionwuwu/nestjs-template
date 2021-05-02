import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 分页参数装饰器
 * @param data 传递参数
 * @param ctx 请求执行上下文信息
 * @author Visionwuwu
 * @returns
 */
export const Page = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let { pageNumber = 1, pageSize = 10 } = request.query;
    pageNumber = parseInt(pageNumber) <= 0 ? 1 : parseInt(pageNumber);
    pageSize = parseInt(pageSize) <= 0 ? 1 : parseInt(pageSize);
    const skip = (pageNumber - 1) * pageSize;
    const page = {
      current: pageNumber,
      limit: pageSize,
      skip,
    };
    return data ? page[data] : page;
  },
);
