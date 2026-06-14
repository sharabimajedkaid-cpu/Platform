import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);
  const logger = new Logger('SearchService');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3011);
  logger.log(`Search Service running on port ${process.env.PORT || 3011}`);
}
bootstrap();
