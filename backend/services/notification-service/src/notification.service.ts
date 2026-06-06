import { Injectable, Logger } from '@nestjs/common';

export interface Notification {
  id: string; userId: string; title: string; body: string;
  type: string; read: boolean; createdAt: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private notifications: Notification[] = [];

  async send(userId: string, title: string, body: string, type = 'system'): Promise<Notification> {
    const notif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId, title, body, type, read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.push(notif);
    if (this.notifications.length > 1000) this.notifications = this.notifications.slice(-500);
    this.logger.log(`Notification sent to ${userId}: ${title}`);
    return notif;
  }

  async sendBulk(userIds: string[], title: string, body: string, type = 'system'): Promise<Notification[]> {
    const results = await Promise.all(userIds.map(uid => this.send(uid, title, body, type)));
    return results;
  }

  async getByUser(userId: string, limit = 50): Promise<Notification[]> {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async markAsRead(id: string): Promise<boolean> {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) { notif.read = true; return true; }
    return false;
  }

  async markAllAsRead(userId: string): Promise<void> {
    this.notifications.forEach(n => { if (n.userId === userId) n.read = true; });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  async sendPushNotification(userId: string, title: string, body: string): Promise<void> {
    this.logger.log(`[PUSH] ${userId}: ${title} - ${body}`);
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    this.logger.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
  }

  async sendSMS(phone: string, message: string): Promise<void> {
    this.logger.log(`[SMS] To: ${phone}, Message: ${message.substring(0, 50)}...`);
  }

  async sendWhatsApp(phone: string, message: string): Promise<void> {
    this.logger.log(`[WHATSAPP] To: ${phone}, Message: ${message.substring(0, 50)}...`);
  }
}
