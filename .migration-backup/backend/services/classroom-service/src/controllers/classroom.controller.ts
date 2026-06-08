import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClassroomService } from '../services/classroom.service';
import { WebRTCService } from '../services/webrtc.service';
import { WhiteboardService } from '../services/whiteboard.service';
import { TurnService } from '../services/turn.service';
import { BreakoutRoomService } from '../services/breakout-room.service';

@ApiTags('classrooms')
@Controller('classrooms')
export class ClassroomController {
  constructor(
    private classroomService: ClassroomService,
    private webrtcService: WebRTCService,
    private whiteboardService: WhiteboardService,
    private turnService: TurnService,
    private breakoutService: BreakoutRoomService,
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
    await this.webrtcService.createRoom(id);
    const classroom = await this.classroomService.joinClassroom(id, participant);
    const rtpCapabilities = this.webrtcService.getRouterRtpCapabilities(id);
    return { classroom, routerRtpCapabilities: rtpCapabilities };
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a classroom' })
  async leave(@Param('id') id: number, @Body() body: { userId: string; participantId: string }) {
    await this.classroomService.leaveClassroom(id, body.userId);
    const roomSize = this.webrtcService.getRoomSize(id);
    if (roomSize === 0) {
      await this.webrtcService.closeRoom(id);
    }
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

  @Get('turn-credentials')
  @ApiOperation({ summary: 'Get TURN server credentials' })
  getTurnCredentials(@Query('userId') userId: string) {
    return this.turnService.generateCredentials(userId || 'anonymous');
  }

  @Post(':id/breakout/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a breakout room' })
  async createBreakout(@Param('id') id: number, @Body() body: { name: string; autoCloseMinutes?: number }) {
    const breakoutId = await this.breakoutService.createBreakoutRoom(id, body.name, body.autoCloseMinutes);
    return { id: breakoutId, name: body.name };
  }

  @Post('breakout/:breakoutId/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join a breakout room' })
  async joinBreakout(@Param('breakoutId') breakoutId: string, @Body() body: { userId: string }) {
    await this.breakoutService.joinBreakoutRoom(body.userId, breakoutId);
    return { success: true };
  }

  @Post('breakout/:breakoutId/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a breakout room' })
  async leaveBreakout(@Param('breakoutId') breakoutId: string, @Body() body: { userId: string }) {
    await this.breakoutService.leaveBreakoutRoom(body.userId);
    return { success: true };
  }

  @Delete('breakout/:breakoutId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close a breakout room' })
  async closeBreakout(@Param('breakoutId') breakoutId: string) {
    await this.breakoutService.closeBreakoutRoom(breakoutId);
    return { success: true };
  }

  @Get(':id/breakouts')
  @ApiOperation({ summary: 'List breakout rooms for classroom' })
  listBreakouts(@Param('id') id: number) {
    return this.breakoutService.getMainRoomBreakouts(id).map(b => ({
      id: b.id, name: b.name, participantCount: b.participants.size,
    }));
  }

  @Post('webrtc/restart-ice')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restart ICE for a transport' })
  async restartIce(@Body() body: { roomId: number; transportId: string }) {
    const iceParameters = await this.webrtcService.restartIce(body.roomId, body.transportId);
    return iceParameters;
  }
}
