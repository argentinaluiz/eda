import { DomainEventManager } from '../domain/domain-event-manager';
import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '../domain/aggregate-root';
import { EntityManager } from '@mikro-orm/mysql';

@Injectable()
export class ApplicationService {
  constructor(
    private entityManager: EntityManager,
    private domainEventManager: DomainEventManager,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  start() {}

  async finish() {
    const uow = this.entityManager.getUnitOfWork();
    const aggregateRoots = [
      //@ts-expect-error - entities are aggregateRoot in this context
      ...(uow.getPersistStack() as AggregateRoot[]),
      //@ts-expect-error - entities are aggregateRoot in this context
      ...(uow.getRemoveStack() as AggregateRoot[]),
    ];
    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventManager.publish(aggregateRoot);
    }
    await this.entityManager.flush();
    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventManager.publishForIntegrationEvent(aggregateRoot);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  fail() {}

  async run<T>(callback: () => Promise<T>): Promise<T> {
    await this.start();
    try {
      const result = await callback();
      await this.finish();
      return result;
    } catch (e) {
      await this.fail();
      throw e;
    }
  }
}
