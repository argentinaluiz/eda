import { Injectable } from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class PaymentGateway {
  pay(invoice: Invoice): Promise<{ transaction_id: number; error: any }> {
    return Promise.resolve({ transaction_id: 1, error: null });
  }
}
