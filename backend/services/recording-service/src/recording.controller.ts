import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RecordingService } from './recording.service';

@ApiTags('recording')
@Controller('recording')
export class RecordingController {
  constructor(private recordingService: RecordingService) {}

  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start recording a classroom' })
  start(@Body() body: { classroomId: number; userId: string }) {
    return this.recordingService.startRecording(body.classroomId, body.userId);
  }

  @Post('stop/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop a recording' })
  stop(@Param('id') id: string) {
    return this.recordingService.stopRecording(id);
  }

  @Post('process/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process recording with AI transcription' })
  process(@Param('id') id: string) {
    return this.recordingService.processRecording(id);
  }

  @Get('classroom/:classroomId')
  @ApiOperation({ summary: 'Get recordings by classroom' })
  getByClassroom(@Param('classroomId') classroomId: number) {
    return this.recordingService.getByClassroom(classroomId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get recordings by user' })
  getByUser(@Param('userId') userId: string) {
    return this.recordingService.getByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recording details' })
  get(@Param('id') id: string) {
    return this.recordingService.getRecording(id);
  }
}
