import { Module } from '@nestjs/common';
import { ClassroomController } from './controllers/classroom.controller';
import { ClassroomService } from './services/classroom.service';
import { WebRTCService } from './services/webrtc.service';
import { WhiteboardService } from './services/whiteboard.service';
import { ClassroomGateway } from './gateways/classroom.gateway';
import { SignalingGateway } from './gateways/signaling.gateway';

@Module({
  controllers: [ClassroomController],
  providers: [
    ClassroomService,
    WebRTCService,
    WhiteboardService,
    ClassroomGateway,
    SignalingGateway,
  ],
  exports: [ClassroomService, WebRTCService],
})
export class ClassroomModule {}
