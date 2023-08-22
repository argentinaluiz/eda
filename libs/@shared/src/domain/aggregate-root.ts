import { IDomainEvent } from './domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot extends Entity {
  events: Set<IDomainEvent> = new Set<IDomainEvent>();
  dispatchedEvents: Set<IDomainEvent> = new Set<IDomainEvent>();

  addEvent(event: IDomainEvent) {
    this.events.add(event);
  }

  markEventsAsDispatched(event: IDomainEvent) {
    this.dispatchedEvents.add(event);
  }

  getUncommittedEvents(): IDomainEvent[] {
    return Array.from(this.events).filter((event) => {
      return !this.dispatchedEvents.has(event);
    });
  }

  clearEvents() {
    this.events.clear();
    this.dispatchedEvents.clear();
  }
}
