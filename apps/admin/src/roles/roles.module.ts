import { Module } from '@nestjs/common';
import { DataScopeService } from 'libs/common/providers/dataScope.service';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService, DataScopeService],
  exports: [RolesService],
})
export class RolesModule {}
