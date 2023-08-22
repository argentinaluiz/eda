import { Injectable } from '@nestjs/common';
import { IDomainEventHandler } from '@shared';
import { DomainEventManager } from '@shared';
import { OrderCreatedEvent } from '../../orders/domain-events/order-created.event';
import { InvoiceRepository } from '../entities/invoice.repository';
import { PaymentGateway } from '../payment.gateway';
import { Invoice, InvoiceStatus } from '../entities/invoice.entity';

@Injectable()
export class ProcessPaymentHandler implements IDomainEventHandler {
  constructor(
    private invoiceRepo: InvoiceRepository,
    private paymentGateway: PaymentGateway,
    private domainEventManager: DomainEventManager,
  ) {}
  async handle(event: OrderCreatedEvent): Promise<void> {
    const invoice = new Invoice(
      event.aggregate_id,
      event.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      InvoiceStatus.PENDING,
    );
    this.invoiceRepo.add(invoice);
    await this.paymentGateway.pay(invoice);
    invoice.pay();
    await this.domainEventManager.publish(invoice);
  }
}
