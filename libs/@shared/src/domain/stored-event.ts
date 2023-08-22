import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AggregateRoot } from './aggregate-root';
import { IDomainEvent } from './domain-event';
import crypto from 'crypto';

@Entity()
export class StoredEvent extends AggregateRoot {
  @PrimaryKey()
  id: string;

  @Property({ type: 'json' })
  body: string;

  @Property()
  type_name: string;

  @Property()
  occurred_on: Date;

  constructor(body: string, type_name: string, occurred_on: Date, id?: string) {
    super();
    this.body = body;
    this.occurred_on = occurred_on;
    this.type_name = type_name;
    this.id = id ?? crypto.randomUUID();
  }

  static create(domainEvent: IDomainEvent) {
    return new StoredEvent(
      JSON.stringify(domainEvent),
      domainEvent.constructor.name,
      domainEvent.occurred_on,
    );
  }

  toJSON() {
    return {
      id: this.id,
      body: this.body,
      ocurred_on: this.occurred_on,
    };
  }
}
