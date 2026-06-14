import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
  ConnectedSocket, MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/messenger',
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private logger = new Logger(MessagingGateway.name);
  private onlineUsers: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      if (!this.onlineUsers.has(userId)) this.onlineUsers.set(userId, new Set());
      this.onlineUsers.get(userId)!.add(client.id);
      this.server.emit('user-online', { userId });
    }
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers.forEach((sockets, userId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.onlineUsers.delete(userId);
        this.server.emit('user-offline', { userId });
      }
    });
  }

  @SubscribeMessage('join-conversation')
  handleJoinConversation(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    client.join(`conv:${data.conversationId}`);
  }

  @SubscribeMessage('leave-conversation')
  handleLeaveConversation(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    client.leave(`conv:${data.conversationId}`);
  }

  @SubscribeMessage('send-message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: {
    conversationId: string; senderId: string; senderName: string; text: string; type?: string; mediaUrl?: string;
  }) {
    const msg = {
      id: `msg-${Date.now()}`,
      conversationId: data.conversationId,
      senderId: data.senderId,
      senderName: data.senderName,
      text: data.text,
      type: data.type || 'text',
      mediaUrl: data.mediaUrl,
      readBy: [data.senderId],
      createdAt: new Date().toISOString(),
    };
    this.server.to(`conv:${data.conversationId}`).emit('new-message', msg);
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string; userId: string }) {
    client.to(`conv:${data.conversationId}`).emit('user-typing', data);
  }

  @SubscribeMessage('stop-typing')
  handleStopTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string; userId: string }) {
    client.to(`conv:${data.conversationId}`).emit('user-stop-typing', data);
  }

  @SubscribeMessage('mark-read')
  handleMarkRead(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string; userId: string }) {
    this.server.to(`conv:${data.conversationId}`).emit('read-receipt', data);
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId) && this.onlineUsers.get(userId)!.size > 0;
  }

  getOnlineUsers(): string[] {
    return Array.from(this.onlineUsers.keys());
  }
}
