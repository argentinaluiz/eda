import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { IIntegrationEvent } from '@shared';

@Processor('integration-events')
export class IntegrationEventsPublisherJob {
  constructor(private amqpConnection: AmqpConnection) {}

  @Process()
  async handle(job: Job<IIntegrationEvent>) {
    console.log('IntegrationEventsPublisher.handle', job.data);
    await this.amqpConnection.publish(
      'amq.direct',
      //events.fullcycle.com/MyEvent
      job.data.event_name,
      job.data,
    );
    return {};
  }
}