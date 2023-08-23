import { IDomainEvent } from '@shared';

export class CustomerCreatedEvent implements IDomainEvent {
  occurred_on: Date;
  event_version: number;

  constructor(
    public aggregate_id: string,
    public name: string,
    public email: string,
    public phone: string,
    public address: string,
  ) {
    this.aggregate_id = aggregate_id;
    this.occurred_on = new Date();
    this.event_version = 1;
  }
}
//event carried state transfer
//event notification
