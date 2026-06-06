import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ProxyMiddleware } from './middleware/proxy.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [ConfigModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
    consumer
      .apply(ProxyMiddleware)
      .exclude('api/docs', 'api/v1/auth/login', 'api/v1/auth/register')
      .forRoutes('*');
  }
}
