import { Injectable } from '@nestjs/common';
import { IDomainEventHandler } from '@shared';
import { DomainEventManager } from '@shared';
import { InvoicePayedEvent } from '../../invoices/domain-events/invoice-payed.event';
import { OrderRepository } from '../entities/order.repository';

@Injectable()
export class ApproveOrderHandler implements IDomainEventHandler {
  constructor(
    private orderRepo: OrderRepository,
    private domainEventManager: DomainEventManager,
  ) {}

  async handle(event: InvoicePayedEvent): Promise<void> {
    const order = await this.orderRepo.findById(event.order_id);
    order.approve();
    await this.domainEventManager.publish(order);
  }
}
