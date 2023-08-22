import { Customer } from './apps/orders/src/customer/entities/customer.entity';
import { Invoice } from './apps/orders/src/invoices/entities/invoice.entity';
import {
  Order,
  OrderItem,
} from './apps/orders/src/orders/entities/order.entity';
import { Product } from './apps/orders/src/products/entities/product.entity';
import { StoredEvent } from './libs/@shared/src/domain/stored-event';

export default {
  entities: [Product, Customer, Order, OrderItem, Invoice, StoredEvent],
  dbName: 'nest',
  host: 'localhost',
  user: 'root',
  password: 'root',
  type: 'mysql',
};
