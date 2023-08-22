import { IDomainEvent } from '@shared';
import { OrderItem, OrderStatus } from '../entities/order.entity';

export class OrderCreatedEvent implements IDomainEvent {
  occurred_on: Date;
  event_version: number;

  constructor(
    public aggregate_id: string,
    public customer_id: string,
    public status: OrderStatus,
    public items: OrderItem[],
  ) {
    this.aggregate_id = aggregate_id;
    this.occurred_on = new Date();
    this.event_version = 1;
  }
}
