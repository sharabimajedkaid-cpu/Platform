import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const logger = new Logger('AuthService');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  await app.listen(process.env.PORT || 3001);
  logger.log(`Auth Service running on port ${process.env.PORT || 3001}`);
}
bootstrap();
