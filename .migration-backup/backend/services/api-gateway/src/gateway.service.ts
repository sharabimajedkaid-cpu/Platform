import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from './config/config.service';

export interface ServiceInfo {
  name: string;
  url: string;
  status: 'active' | 'inactive';
  version: string;
}

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);
  private readonly services: ServiceInfo[] = [];

  constructor(private config: ConfigService) {
    this.initializeServices();
  }

  private initializeServices() {
    const urls = this.config.serviceUrls;
    const serviceNames: Record<string, string> = {
      auth: 'Authentication Service',
      classroom: 'Classroom & WebRTC Service',
      lms: 'Learning Management Service',
      messaging: 'Messaging Service (CE4)',
      ai: 'AI Orchestration Service',
      erp: 'ERP Service',
      analytics: 'Analytics Service',
      notification: 'Notification Service',
      recording: 'Recording Service',
      billing: 'Billing & Subscriptions Service',
      search: 'Search Service',
    };

    for (const [key, url] of Object.entries(urls)) {
      this.services.push({
        name: serviceNames[key] || key,
        url,
        status: 'active',
        version: '4.4.0',
      });
    }
  }

  getAvailableServices(): ServiceInfo[] {
    return this.services;
  }

  getMetrics() {
    return {
      totalServices: this.services.length,
      activeServices: this.services.filter(s => s.status === 'active').length,
      services: this.services,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    };
  }
}
