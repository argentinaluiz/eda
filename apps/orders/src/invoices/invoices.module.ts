import { Module, OnModuleInit } from '@nestjs/common';
import { PaymentGateway } from './payment.gateway';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Invoice } from './entities/invoice.entity';
import { InvoiceRepository } from './entities/invoice.repository';
import { ProcessPaymentHandler } from './handlers/process-payment.handler';
import { DomainEventManager } from '@shared';
import { OrderCreatedEvent } from '../orders/domain-events/order-created.event';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [MikroOrmModule.forFeature([Invoice])],
  providers: [PaymentGateway, InvoiceRepository, ProcessPaymentHandler],
  exports: [PaymentGateway, InvoiceRepository],
})
export class InvoicesModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.domainEventManager.register(
      OrderCreatedEvent.name,
      async (event: OrderCreatedEvent) => {
        const handler: ProcessPaymentHandler = await this.moduleRef.resolve(
          ProcessPaymentHandler,
        );
        await handler.handle(event);
      },
    );
  }
}
