import { NestFactory } from '@nestjs/core';
import { ClassroomModule } from './classroom.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ClassroomModule);
  const logger = new Logger('ClassroomService');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3002);
  logger.log(`Classroom Service running on port ${process.env.PORT || 3002}`);
}
bootstrap();
