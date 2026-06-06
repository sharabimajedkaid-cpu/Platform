import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send notification to user' })
  send(@Body() body: { userId: string; title: string; body: string; type?: string }) {
    return this.notificationService.send(body.userId, body.title, body.body, body.type);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send bulk notification' })
  sendBulk(@Body() body: { userIds: string[]; title: string; body: string; type?: string }) {
    return this.notificationService.sendBulk(body.userIds, body.title, body.body, body.type);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user notifications' })
  getUserNotifications(@Param('userId') userId: string, @Query('limit') limit?: number) {
    return this.notificationService.getByUser(userId, limit);
  }

  @Get('unread/:userId')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@Param('userId') userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Post('read-all/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }
}
