import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ClassroomService } from '../services/classroom.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/classroom',
})
export class ClassroomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger(ClassroomGateway.name);
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(private classroomService: ClassroomService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.userSockets.forEach((sockets, userId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) this.userSockets.delete(userId);
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; userId: string; name: string; role: string }) {
    client.join(`room:${data.roomId}`);
    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, new Set());
    }
    this.userSockets.get(data.userId)!.add(client.id);
    this.server.to(`room:${data.roomId}`).emit('user-joined', {
      userId: data.userId,
      name: data.name,
      role: data.role,
    });
    this.logger.log(`${data.name} joined room ${data.roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; userId: string }) {
    client.leave(`room:${data.roomId}`);
    this.server.to(`room:${data.roomId}`).emit('user-left', { userId: data.userId });
    this.logger.log(`User ${data.userId} left room ${data.roomId}`);
  }

  @SubscribeMessage('raise-hand')
  handleRaiseHand(@MessageBody() data: { roomId: number; userId: string; raised: boolean }) {
    this.server.to(`room:${data.roomId}`).emit('hand-raised', data);
  }

  @SubscribeMessage('mute-toggle')
  handleMuteToggle(@MessageBody() data: { roomId: number; userId: string; muted: boolean }) {
    this.server.to(`room:${data.roomId}`).emit('mute-changed', data);
  }

  @SubscribeMessage('video-toggle')
  handleVideoToggle(@MessageBody() data: { roomId: number; userId: string; videoOn: boolean }) {
    this.server.to(`room:${data.roomId}`).emit('video-changed', data);
  }

  @SubscribeMessage('screen-share')
  handleScreenShare(@MessageBody() data: { roomId: number; userId: string; sharing: boolean }) {
    this.server.to(`room:${data.roomId}`).emit('screen-share-changed', data);
  }

  @SubscribeMessage('reaction')
  handleReaction(@MessageBody() data: { roomId: number; userId: string; emoji: string }) {
    this.server.to(`room:${data.roomId}`).emit('reaction', data);
  }

  @SubscribeMessage('whiteboard-update')
  handleWhiteboardUpdate(@MessageBody() data: { roomId: number; elements: unknown[] }) {
    this.server.to(`room:${data.roomId}`).emit('whiteboard-synced', data);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(@MessageBody() data: { roomId: number; userId: string; name: string; text: string }) {
    this.server.to(`room:${data.roomId}`).emit('new-message', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('breakout-room')
  handleBreakoutRoom(@MessageBody() data: { roomId: number; breakoutRooms: { id: number; participants: string[] }[] }) {
    this.server.to(`room:${data.roomId}`).emit('breakout-rooms-created', data.breakoutRooms);
  }
}
