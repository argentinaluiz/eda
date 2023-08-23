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
    const invoice = Invoice.create({
      order_id: event.aggregate_id,
      amount: event.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      status: InvoiceStatus.PENDING,
    });
    this.invoiceRepo.add(invoice);
    await this.paymentGateway.pay(invoice);
    invoice.pay();
    //InvoiceCreated e InvoicePayed
    await this.domainEventManager.publish(invoice);
  }
}
