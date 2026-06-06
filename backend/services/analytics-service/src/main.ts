import { NestFactory } from '@nestjs/core';
import { AnalyticsModule } from './analytics.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsModule);
  const logger = new Logger('AnalyticsService');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3007);
  logger.log(`Analytics Service running on port ${process.env.PORT || 3007}`);
}
bootstrap();
