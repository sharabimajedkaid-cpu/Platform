import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class TurnService {
  private readonly logger = new Logger(TurnService.name);
  private readonly secret = process.env.TURN_SECRET || 'britishce44-turn-secret';
  private readonly urls = (process.env.TURN_URLS || 'turn:coturn:3478,turns:coturn:5349').split(',');

  generateCredentials(userId: string): { urls: string[]; username: string; credential: string; ttl: number } {
    const ttl = 86400;
    const timestamp = Math.floor(Date.now() / 1000) + ttl;
    const username = `${timestamp}:${userId}`;
    const hmac = createHmac('sha1', this.secret);
    hmac.update(username);
    const credential = hmac.digest('base64');

    this.logger.log(`TURN credentials generated for user ${userId} (expires in ${ttl}s)`);
    return { urls: this.urls, username, credential, ttl };
  }
}
