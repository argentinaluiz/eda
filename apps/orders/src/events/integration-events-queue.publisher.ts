import { Injectable } from '@nestjs/common';
import { IIntegrationEvent } from '@shared';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class IntegrationEventsQueuePublisher {
  constructor(
    @InjectQueue('integration-events')
    private queue: Queue<IIntegrationEvent>,
  ) {}

  async addToQueue(integrationEvent: IIntegrationEvent) {
    await this.queue.add(integrationEvent);
  }
}
