import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './models/user.model';
import { Role } from './models/role.model';
import { Menu } from './models/menu.model';
import { UserRole } from './models/user-role.model';
import { RoleMenu } from './models/role-menu.model';
import { Department } from './models/department.model';

const models = TypegooseModule.forFeature([
  User,
  Role,
  Menu,
  UserRole,
  RoleMenu,
  Department,
]);

@Global()
@Module({
  imports: [
    TypegooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: process.env.DB_URL,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
        };
      },
    }),
    models,
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
