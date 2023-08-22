import { IIntegrationEvent } from '@shared';
import { OrderApprovedEvent } from '../domain-events/order-approved.event';

export class OrderApprovedIntegrationEvent implements IIntegrationEvent {
  event_name: string;
  payload: any;
  event_version: number;
  occurred_on: Date;

  constructor(domainEvent: OrderApprovedEvent) {
    this.event_name = OrderApprovedIntegrationEvent.name;
    this.payload = {
      id: domainEvent.aggregate_id,
      date: domainEvent.occurred_on,
    };
    this.event_version = 1;
    this.occurred_on = domainEvent.occurred_on;
  }
}
