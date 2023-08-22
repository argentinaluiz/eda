import { StoredEvent } from './libs/@shared/src/domain/stored-event';
import { Customer } from './src/customer/entities/customer.entity';
import { Invoice } from './src/invoices/entities/invoice.entity';
import { Order, OrderItem } from './src/orders/entities/order.entity';
import { Product } from './src/products/entities/product.entity';

export default {
  entities: [Product, Customer, Order, OrderItem, Invoice, StoredEvent],
  dbName: 'nest',
  host: 'localhost',
  user: 'root',
  password: 'root',
  type: 'mysql',
};
