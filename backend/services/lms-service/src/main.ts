import { NestFactory } from '@nestjs/core';
import { LmsModule } from './lms.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(LmsModule);
  const logger = new Logger('LmsService');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3003);
  logger.log(`LMS Service running on port ${process.env.PORT || 3003}`);
}
bootstrap();
