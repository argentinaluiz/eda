import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AggregateRoot } from '@shared';
import { CustomerCreatedEvent } from '../domain-events/customer-created.event';
import crypto from 'crypto';
@Entity()
export class Customer extends AggregateRoot {
  @PrimaryKey()
  id: string;

  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  address: string;

  @Property()
  phone: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(
    name: string,
    email: string,
    address: string,
    phone: string,
    id?: string,
  ) {
    super();
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.id = id ?? crypto.randomUUID();
  }

  static create({
    name,
    email,
    address,
    phone,
  }: {
    name: string;
    email: string;
    address: string;
    phone: string;
  }) {
    const customer = new Customer(name, email, address, phone);
    customer.addEvent(
      new CustomerCreatedEvent(customer.id, name, email, phone, address),
    );
    return customer;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      address: this.address,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
