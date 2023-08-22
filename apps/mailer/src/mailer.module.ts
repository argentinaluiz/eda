import { Module } from '@nestjs/common';
import { MailerConsumer } from './mailer.consumer';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  controllers: [],
  providers: [MailerConsumer],
})
export class MailerModule {}
