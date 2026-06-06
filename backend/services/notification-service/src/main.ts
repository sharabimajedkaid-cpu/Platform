import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const logger = new Logger('NotificationService');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3008);
  logger.log(`Notification Service running on port ${process.env.PORT || 3008}`);
}
bootstrap();
