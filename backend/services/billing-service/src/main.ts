import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const logger = new Logger('BillingService');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.PORT || 3010);
  logger.log(`Billing Service running on port ${process.env.PORT || 3010}`);
}
bootstrap();
