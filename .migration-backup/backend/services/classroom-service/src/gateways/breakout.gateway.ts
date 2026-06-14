import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { BreakoutRoomService } from '../services/breakout-room.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/classroom',
})
export class BreakoutGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  private logger = new Logger(BreakoutGateway.name);

  constructor(private breakoutService: BreakoutRoomService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Breakout client connected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; userId: string; name: string }) {
    client.join(`room:${data.roomId}`);
    client.data.mainRoomId = data.roomId;
    client.data.userId = data.userId;
    client.data.userName = data.name;
    client.to(`room:${data.roomId}`).emit('user-joined', { userId: data.userId, name: data.name });
  }

  @SubscribeMessage('send-message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { text: string }) {
    const roomId = client.data.mainRoomId;
    if (!roomId) return;
    this.server.to(`room:${roomId}`).emit('new-message', {
      userId: client.data.userId,
      name: client.data.userName,
      text: data.text,
      timestamp: Date.now(),
    });
  }

  @SubscribeMessage('create-breakout')
  async handleCreateBreakout(@ConnectedSocket() client: Socket, @MessageBody() data: { name: string; autoCloseMinutes?: number }) {
    try {
      const roomId = client.data.mainRoomId;
      if (!roomId) throw new Error('Not in a room');
      const breakoutId = await this.breakoutService.createBreakoutRoom(roomId, data.name, data.autoCloseMinutes);
      const breakouts = this.breakoutService.getMainRoomBreakouts(roomId);
      this.server.to(`room:${roomId}`).emit('breakout-list', breakouts.map(b => ({
        id: b.id, name: b.name, participantCount: b.participants.size,
      })));
      client.emit('breakout-created', { id: breakoutId, name: data.name });
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @SubscribeMessage('join-breakout')
  async handleJoinBreakout(@ConnectedSocket() client: Socket, @MessageBody() data: { breakoutId: string }) {
    try {
      const userId = client.data.userId;
      if (!userId) throw new Error('Not authenticated');
      await this.breakoutService.joinBreakoutRoom(userId, data.breakoutId);
      const breakout = this.breakoutService.getBreakoutRoom(data.breakoutId);
      if (breakout) {
        client.join(`breakout:${data.breakoutId}`);
        client.to(`breakout:${data.breakoutId}`).emit('breakout-user-joined', { userId, name: client.data.userName });
        this.server.to(`room:${client.data.mainRoomId}`).emit('breakout-updated', {
          id: data.breakoutId,
          participantCount: breakout.participants.size,
        });
      }
      client.emit('breakout-joined', { breakoutId: data.breakoutId });
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @SubscribeMessage('leave-breakout')
  async handleLeaveBreakout(@ConnectedSocket() client: Socket) {
    try {
      const userId = client.data.userId;
      if (!userId) return;
      const breakout = this.breakoutService.getUserBreakout(userId);
      await this.breakoutService.leaveBreakoutRoom(userId);
      if (breakout) {
        client.leave(`breakout:${breakout.id}`);
        client.to(`breakout:${breakout.id}`).emit('breakout-user-left', { userId });
        this.server.to(`room:${client.data.mainRoomId}`).emit('breakout-updated', {
          id: breakout.id,
          participantCount: breakout.participants.size,
        });
      }
      client.emit('breakout-left');
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @SubscribeMessage('close-breakout')
  async handleCloseBreakout(@ConnectedSocket() client: Socket, @MessageBody() data: { breakoutId: string }) {
    try {
      await this.breakoutService.closeBreakoutRoom(data.breakoutId);
      this.server.to(`room:${client.data.mainRoomId}`).emit('breakout-closed', { id: data.breakoutId });
      client.emit('breakout-closed', { id: data.breakoutId });
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @SubscribeMessage('list-breakouts')
  handleListBreakouts(@ConnectedSocket() client: Socket) {
    const roomId = client.data.mainRoomId;
    if (!roomId) return;
    const breakouts = this.breakoutService.getMainRoomBreakouts(roomId);
    client.emit('breakout-list', breakouts.map(b => ({
      id: b.id, name: b.name, participantCount: b.participants.size,
    })));
  }
}
