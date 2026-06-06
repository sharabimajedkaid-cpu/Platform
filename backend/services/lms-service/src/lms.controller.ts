import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LmsService } from './lms.service';
import { ExamService } from './exam.service';
import { HomeworkService } from './homework.service';
import { PlacementService } from './placement.service';

@ApiTags('lms')
@Controller('lms')
export class LmsController {
  constructor(
    private lmsService: LmsService,
    private examService: ExamService,
    private homeworkService: HomeworkService,
    private placementService: PlacementService,
  ) {}

  @Get('courses')
  @ApiOperation({ summary: 'Get all courses' })
  getCourses() { return this.lmsService.getCourses(); }

  @Get('courses/:id')
  @ApiOperation({ summary: 'Get course by ID' })
  getCourse(@Param('id') id: string) { return this.lmsService.getCourse(id); }

  @Get('exams')
  @ApiOperation({ summary: 'Get all 100 exams (10 models x 10)' })
  getExams(@Query('model') model?: string) { return this.examService.getExams(model); }

  @Get('exams/:id')
  @ApiOperation({ summary: 'Get exam by ID' })
  getExam(@Param('id') id: string) { return this.examService.getExamById(id); }

  @Post('exams/:id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit exam answers' })
  submitExam(@Param('id') id: string, @Body() body: { studentId: string; studentName: string; answers: { questionId: string; answer: string }[] }) {
    return this.examService.submitExam({ examId: id, ...body });
  }

  @Get('exams/results/:studentId')
  @ApiOperation({ summary: 'Get exam results for student' })
  getResults(@Param('studentId') studentId: string) { return this.examService.getResults(studentId); }

  @Get('homework')
  @ApiOperation({ summary: 'Get all homework submissions' })
  getHomework() { return this.homeworkService.getAll(); }

  @Post('homework')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit homework' })
  submitHomework(@Body() body: { studentId: string; studentName: string; fileName: string; fileSize: string }) {
    return this.homeworkService.submit(body);
  }

  @Get('placement')
  @ApiOperation({ summary: 'Get all placement test results' })
  getPlacements() { return this.placementService.getAll(); }

  @Post('placement')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit placement test result' })
  submitPlacement(@Body() body: { studentId: string; studentName: string; score: number }) {
    return this.placementService.submit(body);
  }

  @Get('certificates')
  @ApiOperation({ summary: 'Get certificates' })
  getCertificates(@Query('studentId') studentId?: string) {
    return this.lmsService.getCertificates(studentId);
  }
}
