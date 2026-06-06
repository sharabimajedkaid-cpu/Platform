import { NestFactory } from '@nestjs/core';
import { ErpModule } from './erp.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ErpModule);
  const logger = new Logger('ErpService');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3006);
  logger.log(`ERP Service running on port ${process.env.PORT || 3006}`);
}
bootstrap();
