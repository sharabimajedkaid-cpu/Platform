import { NestFactory } from '@nestjs/core';
import { AiModule } from './ai.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AiModule);
  const logger = new Logger('AiService');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3005);
  logger.log(`AI Orchestrator running on port ${process.env.PORT || 3005}`);
}
bootstrap();
