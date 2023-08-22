import { NestFactory } from '@nestjs/core';
import { MailerModule } from './mailer.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MailerModule);
  await app.init();
}
bootstrap();
