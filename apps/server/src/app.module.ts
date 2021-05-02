import { Module } from '@nestjs/common';
import { CommonModule } from 'libs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [AuthModule, UsersModule, FilesModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
