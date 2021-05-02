import { HttpStatus, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { IResponseData } from 'libs/common/common';
import { User, UserDocumentType } from 'libs/db/models/user.model';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  /** 创建一个用户 */
  async createUser(user): Promise<UserDocumentType> {
    return await this.userModel.create(user);
  }

  async findUserById(id: any): Promise<IResponseData> {
    const data = await this.userModel.findById(id).populate('avatar');
    return {
      code: HttpStatus.OK,
      message: 'success',
      data,
    };
  }

  async findUserByName(username: string): Promise<UserDocumentType | null> {
    return await this.userModel.findOne({ username }).select('+password');
  }
}
