import { Module } from '@nestjs/common';
import { LmsController } from './lms.controller';
import { LmsService } from './lms.service';
import { ExamService } from './exam.service';
import { HomeworkService } from './homework.service';
import { PlacementService } from './placement.service';

@Module({
  controllers: [LmsController],
  providers: [LmsService, ExamService, HomeworkService, PlacementService],
  exports: [LmsService, ExamService],
})
export class LmsModule {}
