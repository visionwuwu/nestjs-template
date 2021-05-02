import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocumentType } from 'libs/db/models/user.model';
import { FilesService } from '../files/files.service';
import { UsersService } from '../users/users.service';
import { ILoginResult } from './auth';
import { RegisterUserDto } from './dtos/register.dto';
import { IResponseData } from 'libs/common/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByName(username: string): Promise<UserDocumentType> {
    return await this.usersService.findUserByName(username);
  }

  async findUserById(id: string): Promise<IResponseData> {
    return await this.usersService.findUserById(id);
  }

  /** 用户登录 */
  async login(user: UserDocumentType): Promise<ILoginResult> {
    return {
      token: this.jwtService.sign(String(user._id)),
    };
  }

  /** 用户注册 */
  async register(dto: RegisterUserDto): Promise<IResponseData> {
    try {
      const { username } = dto;
      const user = await this.usersService.findUserByName(username);
      if (user) {
        throw new BadRequestException('用户名已存在');
      }
      const result = (
        await this.usersService.createUser({
          ...dto,
          role: 2,
        })
      ).toJSON();
      const { password, ...data } = result;
      return {
        code: HttpStatus.OK,
        message: '注册成功',
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        code: -1,
        message: error.message,
      });
    }
  }

  /** 获取当前用户 */
  async currentUser(user: UserDocumentType): Promise<IResponseData> {
    return {
      code: HttpStatus.OK,
      message: 'success',
      data: user,
    };
  }
}
