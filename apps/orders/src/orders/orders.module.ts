import { Module, OnModuleInit } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './entities/order.repository';
import { ProductsModule } from '../products/products.module';
import { Order, OrderItem } from './entities/order.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { InvoicesModule } from '../invoices/invoices.module';
import { ApproveOrderHandler } from './handlers/approve-order.handler';
import { DomainEventManager } from '@shared';
import { ModuleRef } from '@nestjs/core';
import { InvoicePayedEvent } from '../invoices/domain-events/invoice-payed.event';
import { OrderApprovedEvent } from './domain-events/order-approved.event';
import { OrderApprovedIntegrationEvent } from './integration-events/order-approved.int-event';
import { IntegrationEventsQueuePublisher } from '../events/integration-events-queue.publisher';

@Module({
  imports: [
    MikroOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,
    InvoicesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, ApproveOrderHandler],
})
export class OrdersModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
    private integrationEventsQueue: IntegrationEventsQueuePublisher,
  ) {}

  onModuleInit() {
    this.domainEventManager.register(
      InvoicePayedEvent.name,
      async (event: InvoicePayedEvent) => {
        const handler: ApproveOrderHandler = await this.moduleRef.resolve(
          ApproveOrderHandler,
        );
        await handler.handle(event);
      },
    );
    this.domainEventManager.registerForIntegrationEvent(
      OrderApprovedEvent.name,
      async (event) => {
        console.log('integration events');
        const integrationEvent = new OrderApprovedIntegrationEvent(event);
        await this.integrationEventsQueue.addToQueue(integrationEvent);
      },
    );
  }
}
