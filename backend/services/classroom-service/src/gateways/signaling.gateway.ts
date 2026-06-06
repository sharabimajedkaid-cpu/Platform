import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { WebRTCService } from '../services/webrtc.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/signaling',
})
export class SignalingGateway {
  @WebSocketServer() server: Server;
  private logger = new Logger(SignalingGateway.name);

  constructor(private webrtcService: WebRTCService) {}

  @SubscribeMessage('join-rtc-room')
  async handleJoinRTC(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; userId: string; name: string }) {
    const participant = await this.webrtcService.joinRoom(data.roomId, data.userId, data.name);
    client.join(`rtc:${data.roomId}`);
    client.data.participantId = participant.id;
    client.data.roomId = data.roomId;
    client.emit('rtc-joined', {
      participantId: participant.id,
      participants: this.webrtcService.getRoomParticipants(data.roomId),
      routerRtpCapabilities: this.webrtcService.getRouterRtpCapabilities(data.roomId),
    });
    client.to(`rtc:${data.roomId}`).emit('new-participant', { participantId: participant.id, userId: data.userId, name: data.name });
    this.logger.log(`RTC: ${data.name} joined room ${data.roomId}`);
  }

  @SubscribeMessage('leave-rtc-room')
  async handleLeaveRTC(@ConnectedSocket() client: Socket) {
    const { participantId, roomId } = client.data;
    if (participantId && roomId) {
      await this.webrtcService.leaveRoom(roomId, participantId);
      client.to(`rtc:${roomId}`).emit('participant-left', { participantId });
      client.leave(`rtc:${roomId}`);
    }
  }

  @SubscribeMessage('send-transport')
  handleSendTransport(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; transportOptions: unknown }) {
    const transportId = `transport-${Date.now()}`;
    client.data.sendTransportId = transportId;
    client.emit('send-transport-created', { transportId });
    this.logger.log(`Send transport created for ${client.id}`);
  }

  @SubscribeMessage('recv-transport')
  handleRecvTransport(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; transportOptions: unknown }) {
    const transportId = `transport-recv-${Date.now()}`;
    client.data.recvTransportId = transportId;
    client.emit('recv-transport-created', { transportId });
  }

  @SubscribeMessage('connect-transport')
  handleConnectTransport(@ConnectedSocket() client: Socket, @MessageBody() data: { transportId: string; dtlsParameters: unknown }) {
    client.emit('transport-connected', { transportId: data.transportId });
  }

  @SubscribeMessage('produce')
  handleProduce(@ConnectedSocket() client: Socket, @MessageBody() data: { transportId: string; kind: 'audio' | 'video' | 'screen'; rtpParameters: unknown }) {
    const producerId = `producer-${Date.now()}`;
    const roomId = client.data.roomId;
    client.emit('produced', { id: producerId });
    client.to(`rtc:${roomId}`).emit('new-producer', {
      producerId,
      participantId: client.data.participantId,
      kind: data.kind,
    });
    this.logger.log(`Producer ${producerId} created (${data.kind})`);
  }

  @SubscribeMessage('consume')
  handleConsume(@ConnectedSocket() client: Socket, @MessageBody() data: { transportId: string; producerId: string; rtpCapabilities: unknown }) {
    const consumerId = `consumer-${Date.now()}`;
    client.emit('consumed', {
      id: consumerId,
      producerId: data.producerId,
      kind: 'video',
      rtpParameters: {},
    });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@ConnectedSocket() client: Socket, @MessageBody() data: { transportId: string; candidate: unknown }) {
    client.emit('ice-candidate-processed');
  }
}
