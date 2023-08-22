import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Product } from './products/entities/product.entity';
import { EventsModule } from './events/events.module';
import { CustomersModule } from './customer/customers.module';
import { Customer } from './customer/entities/customer.entity';
import { ApplicationModule } from './application/application.module';
import { Order, OrderItem } from './orders/entities/order.entity';
import { Invoice } from './invoices/entities/invoice.entity';
import { InvoicesModule } from './invoices/invoices.module';
import { BullModule } from '@nestjs/bull';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { StoredEvent } from '@shared';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [Product, Customer, Order, OrderItem, Invoice, StoredEvent],
      dbName: 'nest',
      host: 'localhost',
      user: 'root',
      password: 'root',
      type: 'mysql',
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    RabbitmqModule,
    OrdersModule,
    ProductsModule,
    EventsModule,
    CustomersModule,
    ApplicationModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
