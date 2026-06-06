import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly env: Record<string, string>;

  constructor() {
    this.env = process.env as Record<string, string>;
  }

  get port(): number {
    return parseInt(this.env.PORT, 10) || 3000;
  }

  get jwtSecret(): string {
    return this.env.JWT_SECRET || 'britishce44-jwt-secret-change-in-production';
  }

  get jwtExpiration(): string {
    return this.env.JWT_EXPIRATION || '24h';
  }

  get redisUrl(): string {
    return this.env.REDIS_URL || 'redis://localhost:6379';
  }

  get postgresUrl(): string {
    return this.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/britishce44';
  }

  get mongodbUrl(): string {
    return this.env.MONGODB_URL || 'mongodb://localhost:27017/britishce44';
  }

  get elasticsearchUrl(): string {
    return this.env.ELASTICSEARCH_URL || 'http://localhost:9200';
  }

  get minioEndpoint(): string {
    return this.env.MINIO_ENDPOINT || 'localhost:9000';
  }

  get minioAccessKey(): string {
    return this.env.MINIO_ACCESS_KEY || 'minioadmin';
  }

  get minioSecretKey(): string {
    return this.env.MINIO_SECRET_KEY || 'minioadmin';
  }

  get openAiApiKey(): string {
    return this.env.OPENAI_API_KEY || '';
  }

  get livekitApiKey(): string {
    return this.env.LIVEKIT_API_KEY || '';
  }

  get livekitApiSecret(): string {
    return this.env.LIVEKIT_API_SECRET || '';
  }

  get livekitHost(): string {
    return this.env.LIVEKIT_HOST || 'http://localhost:7880';
  }

  get smtpHost(): string {
    return this.env.SMTP_HOST || 'smtp.gmail.com';
  }

  get smtpPort(): number {
    return parseInt(this.env.SMTP_PORT, 10) || 587;
  }

  get smtpUser(): string {
    return this.env.SMTP_USER || '';
  }

  get smtpPass(): string {
    return this.env.SMTP_PASS || '';
  }

  get sendGridApiKey(): string {
    return this.env.SENDGRID_API_KEY || '';
  }

  get whatsappApiKey(): string {
    return this.env.WHATSAPP_API_KEY || '';
  }

  get twilioAccountSid(): string {
    return this.env.TWILIO_ACCOUNT_SID || '';
  }

  get twilioAuthToken(): string {
    return this.env.TWILIO_AUTH_TOKEN || '';
  }

  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }

  get serviceUrls(): Record<string, string> {
    return {
      auth: this.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      classroom: this.env.CLASSROOM_SERVICE_URL || 'http://localhost:3002',
      lms: this.env.LMS_SERVICE_URL || 'http://localhost:3003',
      messaging: this.env.MESSAGING_SERVICE_URL || 'http://localhost:3004',
      ai: this.env.AI_SERVICE_URL || 'http://localhost:3005',
      erp: this.env.ERP_SERVICE_URL || 'http://localhost:3006',
      analytics: this.env.ANALYTICS_SERVICE_URL || 'http://localhost:3007',
      notification: this.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3008',
      recording: this.env.RECORDING_SERVICE_URL || 'http://localhost:3009',
      billing: this.env.BILLING_SERVICE_URL || 'http://localhost:3010',
      search: this.env.SEARCH_SERVICE_URL || 'http://localhost:3011',
    };
  }
}
