import { IDomainEvent } from '@shared';

export class ProductCreatedEvent implements IDomainEvent {
  occurred_on: Date;
  event_version: number;

  constructor(
    public aggregate_id: string,
    public name: string,
    public price: number,
    public quantity: number,
  ) {
    this.aggregate_id = aggregate_id;
    this.occurred_on = new Date();
    this.event_version = 1;
  }
}
