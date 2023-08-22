import {
  Entity as MikroEntity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  Cascade,
} from '@mikro-orm/core';
import { AggregateRoot, Entity } from '@shared';
import { Customer } from '../../customer/entities/customer.entity';
import { Product } from '../../products/entities/product.entity';
import { Invoice, InvoiceStatus } from '../../invoices/entities/invoice.entity';
import crypto from 'crypto';
import { OrderCreatedEvent } from '../domain-events/order-created.event';
import { OrderApprovedEvent } from '../domain-events/order-approved.event';
import { OrderRejectEvent } from '../domain-events/order-reject.event';

@MikroEntity()
export class Order extends AggregateRoot {
  @PrimaryKey()
  id: string;

  @ManyToOne(() => Customer, { mapToPk: true })
  customer_id: string;

  @Enum(() => OrderStatus)
  status: OrderStatus = OrderStatus.PENDING;

  @OneToMany(() => OrderItem, (item) => item.order_id, {
    eager: true,
    cascade: [Cascade.ALL],
  })
  items = new Collection<OrderItem>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(
    customer_id: string,
    items?: OrderItem[],
    status?: OrderStatus,
    id?: string,
  ) {
    super();
    this.customer_id = customer_id;
    this.items.add(items);
    if (status) {
      this.status = status;
    }
    this.id = id ?? crypto.randomUUID();
  }

  static create({
    customer_id,
    items,
  }: {
    customer_id: string;
    items: { product_id: string; quantity: number; price: number }[];
  }) {
    const order = new Order(customer_id);
    const orderItems = items.map(
      (item) =>
        new OrderItem(order.id, item.product_id, item.quantity, item.price),
    );
    order.items.add(orderItems);
    order.addEvent(
      new OrderCreatedEvent(order.id, customer_id, order.status, orderItems),
    );
    return order;
  }

  approve() {
    this.status = OrderStatus.APPROVED;
    this.addEvent(new OrderApprovedEvent(this.id, new Date()));
  }

  reject() {
    this.status = OrderStatus.REJECTED;
    this.addEvent(new OrderRejectEvent(this.id, new Date()));
  }

  createInvoice() {
    return Invoice.create({
      order_id: this.id,
      amount: this.items
        .getItems()
        .reduce((total, item) => total + item.price * item.quantity, 0),
      status: InvoiceStatus.PENDING,
    });
  }

  toJSON() {
    return {
      id: this.id,
      customer_id: this.customer_id,
      status: this.status,
      items: this.items.getItems().map((item) => item.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export enum OrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@MikroEntity()
export class OrderItem extends Entity {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => Order, { mapToPk: true })
  order_id: string;

  @ManyToOne(() => Product, { mapToPk: true })
  product_id: string;

  @Property({ type: 'int' })
  quantity: number;

  @Property({ type: 'decimal' })
  price: number;

  constructor(
    order_id: string,
    product_id: string,
    quantity: number,
    price: number,
    id?: number,
  ) {
    super();
    this.order_id = order_id;
    this.product_id = product_id;
    this.quantity = quantity;
    this.price = price;

    if (this.id) {
      this.id = id;
    }
  }

  toJSON() {
    return {
      id: this.id,
      order_id: this.order_id,
      product_id: this.product_id,
      quantity: this.quantity,
      price: this.price,
    };
  }
}
