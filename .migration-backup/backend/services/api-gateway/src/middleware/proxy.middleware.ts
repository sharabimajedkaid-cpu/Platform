import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '../config/config.service';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProxyMiddleware.name);

  constructor(private config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const path = req.originalUrl;
    if (path.startsWith('/api/v1/auth')) {
      req.headers['x-service-url'] = this.config.serviceUrls.auth;
    } else if (path.startsWith('/api/v1/classrooms')) {
      req.headers['x-service-url'] = this.config.serviceUrls.classroom;
    } else if (path.startsWith('/api/v1/lms')) {
      req.headers['x-service-url'] = this.config.serviceUrls.lms;
    } else if (path.startsWith('/api/v1/messaging')) {
      req.headers['x-service-url'] = this.config.serviceUrls.messaging;
    } else if (path.startsWith('/api/v1/ai')) {
      req.headers['x-service-url'] = this.config.serviceUrls.ai;
    } else if (path.startsWith('/api/v1/erp')) {
      req.headers['x-service-url'] = this.config.serviceUrls.erp;
    } else if (path.startsWith('/api/v1/analytics')) {
      req.headers['x-service-url'] = this.config.serviceUrls.analytics;
    }
    next();
  }
}
