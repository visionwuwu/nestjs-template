import { Module } from '@nestjs/common';
import { DataScopeService } from 'libs/common/providers/dataScope.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DataScopeService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
