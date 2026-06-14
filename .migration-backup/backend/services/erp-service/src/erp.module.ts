import { Module } from '@nestjs/common';
import { ErpController } from './erp.controller';
import { HrService } from './hr.service';
import { FinanceService } from './finance.service';
import { AdmissionsService } from './admissions.service';

@Module({
  controllers: [ErpController],
  providers: [HrService, FinanceService, AdmissionsService],
  exports: [HrService, FinanceService],
})
export class ErpModule {}
