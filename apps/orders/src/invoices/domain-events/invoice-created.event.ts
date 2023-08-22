import { IDomainEvent } from '@shared';
import { InvoiceStatus } from '../entities/invoice.entity';

export class InvoiceCreatedEvent implements IDomainEvent {
  occurred_on: Date;
  event_version: number;

  constructor(
    public aggregate_id: string,
    public order_id: string,
    public status: InvoiceStatus,
    public amount: number,
  ) {
    this.aggregate_id = aggregate_id;
    this.occurred_on = new Date();
    this.event_version = 1;
  }
}
