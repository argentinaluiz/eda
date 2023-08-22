import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DomainEventManager, IDomainEvent } from '@shared';
import { StoredEvent } from '@shared';
import { StoredEventRepository } from '@shared';
import { ModuleRef } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
import { IntegrationEventsPublisherJob } from './integration-events-publisher.job';
import { IntegrationEventsQueuePublisher } from './integration-events-queue.publisher';


@Global()
@Module({
  imports: [
    MikroOrmModule.forFeature([StoredEvent]),
    BullModule.registerQueue({
      name: 'integration-events',
    }),
  ],
  providers: [
    DomainEventManager,
    StoredEventRepository,
    IntegrationEventsPublisherJob,
    IntegrationEventsQueuePublisher,
  ],
  exports: [DomainEventManager, IntegrationEventsQueuePublisher],
})
export class EventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.domainEventManager.register('*', async (event: IDomainEvent) => {
      const repo = await this.moduleRef.resolve(StoredEventRepository);
      await repo.add(event);
    });
  }
}
