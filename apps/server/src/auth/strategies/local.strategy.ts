import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy, IStrategyOptions } from 'passport-local';
import { compareSync } from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    const user = await this.authService.findUserByName(username);

    if (!user) {
      throw new BadRequestException('用户名错误');
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误');
    }

    return user;
  }
}
