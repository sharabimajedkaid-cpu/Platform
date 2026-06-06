import { Module } from '@nestjs/common';
import { ClassroomController } from './controllers/classroom.controller';
import { ClassroomService } from './services/classroom.service';
import { WebRTCService } from './services/webrtc.service';
import { WhiteboardService } from './services/whiteboard.service';
import { TurnService } from './services/turn.service';
import { BreakoutRoomService } from './services/breakout-room.service';
import { PollService } from './services/poll.service';
import { ClassroomGateway } from './gateways/classroom.gateway';
import { SignalingGateway } from './gateways/signaling.gateway';
import { BreakoutGateway } from './gateways/breakout.gateway';

@Module({
  controllers: [ClassroomController],
  providers: [
    ClassroomService,
    WebRTCService,
    WhiteboardService,
    TurnService,
    BreakoutRoomService,
    PollService,
    ClassroomGateway,
    SignalingGateway,
    BreakoutGateway,
  ],
  exports: [ClassroomService, WebRTCService, TurnService, BreakoutRoomService],
})
export class ClassroomModule {}
