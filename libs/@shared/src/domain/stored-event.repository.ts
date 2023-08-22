import { EntityManager } from '@mikro-orm/mysql';
import { StoredEvent } from './stored-event';
import { IDomainEvent } from './domain-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoredEventRepository {
  constructor(private entityManager: EntityManager) {}

  allBetween(lowEventId: string, highEventId: string): Promise<StoredEvent[]> {
    return this.entityManager.find(StoredEvent, {
      id: { $gte: lowEventId, $lte: highEventId },
    });
  }

  allSince(eventId: string): Promise<StoredEvent[]> {
    return this.entityManager.find(StoredEvent, { id: { $gte: eventId } });
  }

  add(domainEvent: IDomainEvent): StoredEvent {
    const storedEvent = StoredEvent.create(domainEvent);
    this.entityManager.persist(storedEvent);
    return storedEvent;
  }
}
