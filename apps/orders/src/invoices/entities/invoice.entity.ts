import {
  Entity as MikroEntity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { AggregateRoot } from '@shared';
import { Order } from '../../orders/entities/order.entity';
import { InvoiceCreatedEvent } from '../domain-events/invoice-created.event';
import crypto from 'crypto';
import { InvoicePayedEvent } from '../domain-events/invoice-payed.event';

@MikroEntity()
export class Invoice extends AggregateRoot {
  @PrimaryKey()
  id: string;

  @ManyToOne(() => Order, { mapToPk: true })
  order_id: string;

  @Enum(() => InvoiceStatus)
  status: InvoiceStatus;

  @Property({ type: 'decimal' })
  amount: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(
    order_id: string,
    amount: number,
    status: InvoiceStatus,
    id?: string,
  ) {
    super();
    this.order_id = order_id;
    this.amount = amount;
    this.status = status;
    this.id = id ?? crypto.randomUUID();
  }

  static create({
    order_id,
    amount,
    status,
  }: {
    order_id: string;
    amount: number;
    status: InvoiceStatus;
  }) {
    const invoice = new Invoice(order_id, amount, status);
    invoice.addEvent(
      new InvoiceCreatedEvent(invoice.id, order_id, status, amount),
    );
    return invoice;
  }

  pay() {
    this.status = InvoiceStatus.PAYED;
    this.addEvent(new InvoicePayedEvent(this.id, this.order_id, new Date()));
  }

  reject() {
    this.status = InvoiceStatus.REJECTED;
  }

  toJSON() {
    return {
      id: this.id,
      order_id: this.order_id,
      amount: this.amount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAYED = 'PAYED',
  REJECTED = 'REJECTED',
}
