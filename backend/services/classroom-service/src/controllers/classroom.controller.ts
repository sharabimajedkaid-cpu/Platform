import { Controller, Get, Post, Put, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClassroomService } from '../services/classroom.service';
import { WebRTCService } from '../services/webrtc.service';
import { WhiteboardService } from '../services/whiteboard.service';

@ApiTags('classrooms')
@Controller('classrooms')
export class ClassroomController {
  constructor(
    private classroomService: ClassroomService,
    private webrtcService: WebRTCService,
    private whiteboardService: WhiteboardService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all 240 classrooms' })
  getAll() {
    return this.classroomService.getAllClassrooms();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active classrooms' })
  getActive() {
    return this.classroomService.getActiveClassrooms();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get classroom by ID' })
  getById(@Param('id') id: number) {
    return this.classroomService.getClassroom(id);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get classroom participants' })
  getParticipants(@Param('id') id: number) {
    return {
      participants: this.classroomService.getParticipants(id),
      count: this.classroomService.getParticipantCount(id),
    };
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join a classroom' })
  async join(@Param('id') id: number, @Body() body: { userId: string; name: string; role: string }) {
    const participant = {
      id: `p-${Date.now()}`,
      userId: body.userId,
      name: body.name,
      role: body.role,
      isMuted: false,
      isVideoOn: true,
      isScreenSharing: false,
      raisedHand: false,
    };
    const classroom = await this.classroomService.joinClassroom(id, participant);
    const rtcParticipant = await this.webrtcService.joinRoom(id, body.userId, body.name);
    return { classroom, rtcParticipant };
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a classroom' })
  async leave(@Param('id') id: number, @Body() body: { userId: string; participantId: string }) {
    await this.classroomService.leaveClassroom(id, body.userId);
    await this.webrtcService.leaveRoom(id, body.participantId);
    return { success: true };
  }

  @Put(':id/raise-hand')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle raise hand' })
  async toggleRaiseHand(@Param('id') id: number, @Body() body: { userId: string }) {
    const raised = await this.classroomService.toggleRaiseHand(id, body.userId);
    return { raisedHand: raised };
  }

  @Get(':id/whiteboard')
  @ApiOperation({ summary: 'Get whiteboard state' })
  getWhiteboard(@Param('id') id: number) {
    return this.whiteboardService.getWhiteboard(id);
  }

  @Get('webrtc/stats')
  @ApiOperation({ summary: 'Get WebRTC service stats' })
  getWebRTCStats() {
    return this.webrtcService.getStats();
  }

  @Get('webrtc/capabilities/:id')
  @ApiOperation({ summary: 'Get router RTP capabilities' })
  getCapabilities(@Param('id') id: number) {
    return this.webrtcService.getRouterRtpCapabilities(id);
  }
}
