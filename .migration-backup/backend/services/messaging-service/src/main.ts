import { NestFactory } from '@nestjs/core';
import { MessagingModule } from './messaging.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MessagingModule);
  const logger = new Logger('MessagingService');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3004);
  logger.log(`Messaging Service running on port ${process.env.PORT || 3004}`);
}
bootstrap();
