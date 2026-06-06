import { NestFactory } from '@nestjs/core';
import { RecordingModule } from './recording.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RecordingModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  const logger = new Logger('RecordingService');
  await app.listen(process.env.PORT || 3009);
  logger.log(`Recording Service running on port ${process.env.PORT || 3009}`);
}
bootstrap();
