import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users.service';
import { Strategy, IStrategyOptions } from 'passport-local';
import { compareSync } from 'bcrypt';
import { ApiStatusCode } from 'libs/common/enums/api-status-code.enum';
import { UserStatus } from 'libs/db/models/user.model';
import { ApiException } from 'libs/common/exceptions/ApiException';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly userService: UsersService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    const user = await this.userService.findUserByName(username);

    if (!user) {
      throw new ApiException(
        '用户名错误',
        HttpStatus.OK,
        ApiStatusCode.USERNAME_ERROR,
      );
    }

    if (user.status === UserStatus.disable) {
      throw new ApiException(
        '账号已被锁定,请联系管理员！！！',
        HttpStatus.OK,
        ApiStatusCode.USERNAME_ERROR,
      );
    }

    if (!compareSync(password, user.password)) {
      throw new ApiException(
        '密码错误',
        HttpStatus.OK,
        ApiStatusCode.USERNAME_ERROR,
      );
    }

    return user;
  }
}
