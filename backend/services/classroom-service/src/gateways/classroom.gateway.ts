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
import { PollService } from '../services/poll.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/classroom',
})
export class ClassroomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private logger = new Logger(ClassroomGateway.name);
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    private classroomService: ClassroomService,
    private pollService: PollService,
  ) {}

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
    client.data.roomId = data.roomId;
    client.data.userRole = data.role;
    this.server.to(`room:${data.roomId}`).emit('user-joined', {
      userId: data.userId, name: data.name, role: data.role,
    });
    this.logger.log(`${data.name} joined room ${data.roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; userId: string }) {
    client.leave(`room:${data.roomId}`);
    this.server.to(`room:${data.roomId}`).emit('user-left', { userId: data.userId });
    this.logger.log(`User ${data.userId} left room ${data.roomId}`);
  }

  // --- Teacher controls ---
  @SubscribeMessage('mute-all')
  handleMuteAll(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number }) {
    if (client.data.userRole !== 'teacher') return;
    this.server.to(`room:${data.roomId}`).emit('mute-all');
    this.logger.log(`Teacher muted all in room ${data.roomId}`);
  }

  @SubscribeMessage('spotlight')
  handleSpotlight(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; userId: string }) {
    if (client.data.userRole !== 'teacher') return;
    this.server.to(`room:${data.roomId}`).emit('spotlight-changed', { userId: data.userId });
    this.logger.log(`Teacher spotlighted ${data.userId} in room ${data.roomId}`);
  }

  @SubscribeMessage('lock-room')
  handleLockRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; locked: boolean }) {
    if (client.data.userRole !== 'teacher') return;
    this.server.to(`room:${data.roomId}`).emit('room-locked', { locked: data.locked });
    this.logger.log(`Room ${data.roomId} ${data.locked ? 'locked' : 'unlocked'}`);
  }

  @SubscribeMessage('eject-user')
  handleEjectUser(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; userId: string }) {
    if (client.data.userRole !== 'teacher') return;
    this.server.to(`room:${data.roomId}`).emit('user-ejected', { userId: data.userId });
    this.logger.log(`User ${data.userId} ejected from room ${data.roomId}`);
  }

  // --- Polls ---
  @SubscribeMessage('create-poll')
  handleCreatePoll(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; question: string; options: string[] }) {
    if (client.data.userRole !== 'teacher') return;
    const poll = this.pollService.createPoll(data.roomId, data.question, data.options, client.data.userId);
    this.server.to(`room:${data.roomId}`).emit('poll-created', poll);
    this.logger.log(`Poll created in room ${data.roomId}: "${data.question}"`);
  }

  @SubscribeMessage('vote')
  handleVote(@ConnectedSocket() client: Socket, @MessageBody() data: { pollId: string; optionId: string }) {
    const result = this.pollService.vote(data.pollId, client.data.userId, data.optionId);
    if (result.error) {
      client.emit('vote-error', { error: result.error });
      return;
    }
    const roomId = client.data.roomId;
    this.server.to(`room:${roomId}`).emit('poll-updated', result.poll);
    const active = this.pollService.getActivePoll(roomId);
    if (active) {
      this.server.to(`room:${roomId}`).emit('live-poll-results', {
        id: active.id, options: active.options.map(o => ({ text: o.text, votes: o.votes, percent: active.totalVotes > 0 ? Math.round((o.votes / active.totalVotes) * 100) : 0 })), totalVotes: active.totalVotes,
      });
    }
  }

  @SubscribeMessage('end-poll')
  handleEndPoll(@ConnectedSocket() client: Socket, @MessageBody() data: { pollId: string }) {
    if (client.data.userRole !== 'teacher') return;
    const poll = this.pollService.endPoll(data.pollId);
    if (poll) {
      this.server.to(`room:${client.data.roomId}`).emit('poll-ended', poll);
    }
  }

  @SubscribeMessage('request-poll-state')
  handleRequestPollState(@ConnectedSocket() client: Socket) {
    const active = this.pollService.getActivePoll(client.data.roomId);
    if (active) {
      client.emit('poll-created', active);
      client.emit('live-poll-results', {
        id: active.id, options: active.options.map(o => ({ text: o.text, votes: o.votes, percent: active.totalVotes > 0 ? Math.round((o.votes / active.totalVotes) * 100) : 0 })), totalVotes: active.totalVotes,
      });
    }
  }

  // --- Recording events ---
  @SubscribeMessage('start-recording')
  handleStartRecording(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number; quality?: string }) {
    if (client.data.userRole !== 'teacher') return;
    this.server.to(`room:${data.roomId}`).emit('recording-started', {
      startedBy: client.data.userId, quality: data.quality || '1080p', startedAt: new Date().toISOString(),
    });
  }

  @SubscribeMessage('stop-recording')
  handleStopRecording(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number }) {
    if (client.data.userRole !== 'teacher') return;
    this.server.to(`room:${data.roomId}`).emit('recording-stopped', { stoppedBy: client.data.userId });
  }

  // --- Existing events ---
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
      ...data, timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('breakout-room')
  handleBreakoutRoom(@MessageBody() data: { roomId: number; breakoutRooms: { id: number; participants: string[] }[] }) {
    this.server.to(`room:${data.roomId}`).emit('breakout-rooms-created', data.breakoutRooms);
  }
}
