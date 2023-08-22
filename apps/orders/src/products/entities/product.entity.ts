import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AggregateRoot } from '@shared';
import { ProductCreatedEvent } from '../domain-events/product-created.event';
import crypto from 'crypto';

@Entity()
export class Product extends AggregateRoot {
  @PrimaryKey()
  id: string;

  @Property()
  name: string;

  @Property({ columnType: 'decimal' })
  price: number;

  @Property({ columnType: 'int' })
  quantity: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(name: string, price: number, quantity: number, id?: string) {
    super();
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.id = id ?? crypto.randomUUID();
  }

  static create({
    name,
    price,
    quantity,
  }: {
    name: string;
    price: number;
    quantity: number;
  }) {
    const product = new Product(name, price, quantity);
    product.addEvent(
      new ProductCreatedEvent(product.id, name, price, quantity),
    );
    return product;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
