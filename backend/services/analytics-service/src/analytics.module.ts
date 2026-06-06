import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ReportService } from './report.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, ReportService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
