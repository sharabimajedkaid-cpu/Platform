import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MessagingService } from './messaging.service';

@ApiTags('messaging')
@Controller('messaging')
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new conversation' })
  createConversation(@Body() body: { participants: string[]; participantNames: Record<string, string> }) {
    return this.messagingService.createConversation(body.participants, body.participantNames);
  }

  @Get('conversations/:userId')
  @ApiOperation({ summary: 'Get user conversations' })
  getConversations(@Param('userId') userId: string) {
    return this.messagingService.getConversations(userId);
  }

  @Get('conversation/:id')
  @ApiOperation({ summary: 'Get conversation details' })
  getConversation(@Param('id') id: string) {
    return this.messagingService.getConversation(id);
  }

  @Get('conversation/:id/messages')
  @ApiOperation({ summary: 'Get conversation messages' })
  getMessages(@Param('id') id: string) {
    return this.messagingService.getMessages(id);
  }

  @Post('conversation/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message' })
  sendMessage(@Param('id') id: string, @Body() body: { senderId: string; senderName: string; text: string; type?: string; mediaUrl?: string }) {
    return this.messagingService.sendMessage(id, body.senderId, body.senderName, body.text, body.type as any, body.mediaUrl);
  }

  @Post('conversation/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark conversation as read' })
  markAsRead(@Param('id') id: string, @Body() body: { userId: string }) {
    this.messagingService.markAsRead(id, body.userId);
    return { success: true };
  }

  @Get('unread/:userId')
  @ApiOperation({ summary: 'Get unread count for user' })
  getUnreadCount(@Param('userId') userId: string) {
    return { unreadCount: this.messagingService.getUnreadCount(userId) };
  }
}
