import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { types as mediasoupTypes } from 'mediasoup';
import { WebRTCService } from '../services/webrtc.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/signaling',
})
export class SignalingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private logger = new Logger(SignalingGateway.name);

  constructor(private webrtcService: WebRTCService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Signaling client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const roomId = client.data.roomId;
    const participantId = client.data.participantId;
    if (roomId) {
      await this.cleanupParticipant(client, roomId);
      client.to(`rtc:${roomId}`).emit('participant-left', { participantId });
    }
    this.logger.log(`Signaling client disconnected: ${client.id}`);
  }

  private async cleanupParticipant(client: Socket, roomId: number) {
    const producerIds: string[] = client.data.producerIds || [];
    for (const pid of producerIds) {
      await this.webrtcService.closeProducer(roomId, pid);
    }
    const transportIds: string[] = client.data.transportIds || [];
    for (const tid of transportIds) {
      await this.webrtcService.closeTransport(roomId, tid);
    }
    client.data.producerIds = [];
    client.data.transportIds = [];
    const roomSize = this.webrtcService.getRoomSize(roomId);
    if (roomSize === 0) {
      await this.webrtcService.closeRoom(roomId);
    }
  }

  @SubscribeMessage('join-rtc-room')
  async handleJoinRTC(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; userId: string; name: string }) {
    try {
      await this.webrtcService.createRoom(data.roomId);
      client.join(`rtc:${data.roomId}`);
      client.data.roomId = data.roomId;
      client.data.participantId = data.userId;
      client.data.producerIds = [];
      client.data.transportIds = [];
      const routerRtpCapabilities = this.webrtcService.getRouterRtpCapabilities(data.roomId);
      client.emit('rtc-joined', {
        participantId: data.userId,
        routerRtpCapabilities,
      });
      client.to(`rtc:${data.roomId}`).emit('new-participant', {
        participantId: data.userId,
        userId: data.userId,
        name: data.name,
      });
      this.logger.log(`RTC: ${data.name} joined room ${data.roomId}`);
    } catch (err) {
      this.logger.error(`join-rtc-room error: ${(err as Error).message}`);
      client.emit('error', { message: 'Failed to join RTC room' });
    }
  }

  @SubscribeMessage('leave-rtc-room')
  async handleLeaveRTC(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;
    const participantId = client.data.participantId;
    if (roomId && participantId) {
      await this.cleanupParticipant(client, roomId);
      client.to(`rtc:${roomId}`).emit('participant-left', { participantId });
      client.leave(`rtc:${roomId}`);
      client.data.roomId = null;
    }
  }

  @SubscribeMessage('create-send-transport')
  async handleCreateSendTransport(@ConnectedSocket() client: Socket) {
    try {
      const roomId = client.data.roomId;
      if (!roomId) throw new Error('Not in a room');
      const transportParams = await this.webrtcService.createSendTransport(roomId);
      client.data.transportIds = [...(client.data.transportIds || []), transportParams.id];
      client.emit('send-transport-created', transportParams);
    } catch (err) {
      this.logger.error(`create-send-transport error: ${(err as Error).message}`);
      client.emit('error', { message: 'Failed to create send transport' });
    }
  }

  @SubscribeMessage('create-recv-transport')
  async handleCreateRecvTransport(@ConnectedSocket() client: Socket) {
    try {
      const roomId = client.data.roomId;
      if (!roomId) throw new Error('Not in a room');
      const transportParams = await this.webrtcService.createRecvTransport(roomId);
      client.data.transportIds = [...(client.data.transportIds || []), transportParams.id];
      client.emit('recv-transport-created', transportParams);
    } catch (err) {
      this.logger.error(`create-recv-transport error: ${(err as Error).message}`);
      client.emit('error', { message: 'Failed to create recv transport' });
    }
  }

  @SubscribeMessage('connect-transport')
  async handleConnectTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { transportId: string; dtlsParameters: mediasoupTypes.DtlsParameters },
  ) {
    try {
      const roomId = client.data.roomId;
      if (!roomId) throw new Error('Not in a room');
      await this.webrtcService.connectTransport(roomId, data.transportId, data.dtlsParameters);
      client.emit('transport-connected', { transportId: data.transportId });
    } catch (err) {
      this.logger.error(`connect-transport error: ${(err as Error).message}`);
      client.emit('error', { message: 'Failed to connect transport' });
    }
  }

  @SubscribeMessage('produce')
  async handleProduce(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { transportId: string; kind: mediasoupTypes.MediaKind; rtpParameters: mediasoupTypes.RtpParameters },
  ) {
    try {
      const roomId = client.data.roomId;
      if (!roomId) throw new Error('Not in a room');
      const producer = await this.webrtcService.produce(roomId, data.transportId, data.kind, data.rtpParameters);
      client.data.producerIds = [...(client.data.producerIds || []), producer.id];
      client.emit('produced', { id: producer.id });
      client.to(`rtc:${roomId}`).emit('new-producer', {
        producerId: producer.id,
        participantId: client.data.participantId,
        kind: data.kind,
      });
      this.logger.log(`Producer ${producer.id} (${data.kind}) created by ${client.data.participantId}`);
    } catch (err) {
      this.logger.error(`produce error: ${(err as Error).message}`);
      client.emit('error', { message: 'Failed to produce' });
    }
  }

  @SubscribeMessage('consume')
  async handleConsume(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { transportId: string; producerId: string; rtpCapabilities: mediasoupTypes.RtpCapabilities },
  ) {
    try {
      const roomId = client.data.roomId;
      if (!roomId) throw new Error('Not in a room');
      const consumer = await this.webrtcService.consume(roomId, data.transportId, data.producerId, data.rtpCapabilities);
      client.emit('consumed', consumer);
    } catch (err) {
      this.logger.error(`consume error: ${(err as Error).message}`);
      client.emit('error', { message: 'Failed to consume' });
    }
  }

  @SubscribeMessage('close-producer')
  async handleCloseProducer(@ConnectedSocket() client: Socket, @MessageBody() data: { producerId: string }) {
    try {
      const roomId = client.data.roomId;
      if (!roomId) return;
      await this.webrtcService.closeProducer(roomId, data.producerId);
      client.data.producerIds = (client.data.producerIds || []).filter((id: string) => id !== data.producerId);
      client.to(`rtc:${roomId}`).emit('producer-closed', { producerId: data.producerId });
    } catch (err) {
      this.logger.error(`close-producer error: ${(err as Error).message}`);
    }
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@ConnectedSocket() client: Socket, @MessageBody() data: { transportId: string; candidate: unknown }) {
    client.emit('ice-candidate-processed', { transportId: data.transportId });
  }

  @SubscribeMessage('restart-ice')
  async handleRestartIce(@ConnectedSocket() client: Socket) {
    try {
      const roomId = client.data.roomId;
      if (!roomId) throw new Error('Not in a room');
      const transportIds: string[] = client.data.transportIds || [];
      const iceParams: Record<string, unknown> = {};
      for (const tid of transportIds) {
        iceParams[tid] = await this.webrtcService.restartIce(roomId, tid);
      }
      client.emit('ice-restarted', iceParams);
      this.logger.log(`ICE restarted for client ${client.id} in room ${roomId}`);
    } catch (err) {
      this.logger.error(`restart-ice error: ${(err as Error).message}`);
      client.emit('error', { message: 'Failed to restart ICE' });
    }
  }
}
