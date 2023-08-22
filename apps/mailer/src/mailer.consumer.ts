import { Injectable } from '@nestjs/common';
import { OrderApprovedIntegrationEvent } from '../../orders/src/orders/integration-events/order-approved.int-event';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class MailerConsumer {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: OrderApprovedIntegrationEvent.name,
    //routingKey: 'events.fullcycle.com/*',
    queue: 'mailer',
  })
  consume(msg: { event_name: string; [key: string]: any }) {
    console.log('Received message:', msg);
  }
}
