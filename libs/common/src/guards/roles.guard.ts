import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { ApiStatusCode } from '../enums/api-status-code.enum';

type StringIndex = { [prop: string]: any };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /** 访问接口需要的角色 */
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    /** 无需角色 */
    if (!requiredRoles) {
      return false;
    }
    // 当前用户
    const { user } = context.switchToHttp().getRequest<Request & StringIndex>();
    return this.matchRoles(requiredRoles, user.type);
  }

  matchRoles(roles: Role[], userRole) {
    const hasRole = roles.includes(userRole);
    if (!hasRole) {
      throw new UnauthorizedException({
        code: ApiStatusCode.UNAUTHORIZED,
        message: '访问权限不足，拒绝访问！',
      });
    }
    return true;
  }
}
