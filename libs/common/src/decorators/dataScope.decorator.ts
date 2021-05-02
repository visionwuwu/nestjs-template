import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DataScope = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    return data ? user && user[data] : user;
  },
);
