import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { DataScopeService } from 'libs/common/providers/dataScope.service';

@Module({
  imports: [PassportModule],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, LocalStrategy, DataScopeService],
  exports: [UsersService],
})
export class UsersModule {}
