import { Module } from '@nestjs/common';
import { CommonModule } from 'libs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from './users/users.module';
import { MenusModule } from './menus/menus.module';
import { RolesModule } from './roles/roles.module';
import { FilesModule } from './files/files.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    MenusModule,
    DepartmentsModule,
    FilesModule,
    CommonModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
