import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './entities/order.repository';
import { ApplicationService } from '@shared';
import { Order } from './entities/order.entity';
import { ProductRepository } from '../products/entities/product.repository';
import { InvoiceRepository } from '../invoices/entities/invoice.repository';
import { PaymentGateway } from '../invoices/payment.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepo: OrderRepository,
    private productRepo: ProductRepository,
    private paymentGateway: PaymentGateway,
    private invoiceRepo: InvoiceRepository,
    private appService: ApplicationService,
  ) {}

  async process(createOrderDto: CreateOrderDto) {
    const products = await this.productRepo.findByIds(
      createOrderDto.items.map((item) => item.product_id),
    );

    const items = createOrderDto.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: products.find((product) => product.id === item.product_id).price,
    }));

    return this.appService.run(async () => {
      const order = Order.create({
        customer_id: createOrderDto.customer_id,
        items,
      });
      this.orderRepo.add(order);
      return order;
    });
  }

  findAll() {
    return this.orderRepo.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

//procedural
// const order = Order.create({
//   customer_id: createOrderDto.customer_id,
//   items,
// });
// this.orderRepo.add(order);
// const invoice = order.createInvoice();
// this.invoiceRepo.add(invoice);
// const payment = await this.paymentGateway.pay(invoice);
// if (!payment.error) {
//   invoice.pay();
//   order.approve();
// } else {
//   invoice.reject();
//   order.reject();
// }
// //enviar e-mail