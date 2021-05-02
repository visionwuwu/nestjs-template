import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from 'libs/db/models/user.model';
import { LOGICAL_KEY } from '../decorators/logical.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Logical } from '../enums/logical.enum';
import { ApiStatusCode } from '../enums/api-status-code.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    /** 需要的权限 */
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    /** 权限判定的逻辑 */
    const logical = this.reflector.getAllAndOverride<Logical>(LOGICAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(logical, 'logical');
    /** 不需要权限 */
    if (!requiredPermissions) {
      return true;
    }
    /** 获取当前用户 */
    const { user } = context.switchToHttp().getRequest();
    /** 超级管理员直接授权 */
    if (user.type === UserType.admin) {
      return true;
    }
    /** 当前用户没有角色 */
    if (!user.roleIdList || user.roleIdList.length === 0) {
      throw new UnauthorizedException({
        code: ApiStatusCode.UNAUTHORIZED,
        message: '访问权限不足，拒绝访问！',
      });
    }
    const permissions = user.permissions;
    console.log(permissions);
    /** 是否具有权限 */
    let hasPerms = false;
    if (logical === Logical.AND) {
      hasPerms = requiredPermissions.every((perm) =>
        permissions.includes(perm),
      );
    } else {
      hasPerms = requiredPermissions.some((perm) => permissions.includes(perm));
    }
    /** 无权限 */
    if (!hasPerms) {
      throw new UnauthorizedException({
        code: ApiStatusCode.UNAUTHORIZED,
        message: '访问权限不足，拒绝访问！',
      });
    }
    return hasPerms;
  }
}
