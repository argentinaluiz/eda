import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CustomerRepository } from './entities/customer.repository';
import { Customer } from './entities/customer.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DomainEventManager } from '@shared';
import { CustomerCreatedEvent } from './domain-events/customer-created.event';

@Module({
  imports: [MikroOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService, CustomerRepository],
})
export class CustomersModule {
  constructor(private readonly domainEventManager: DomainEventManager) {}

  onModuleInit() {
    this.domainEventManager.register(
      CustomerCreatedEvent.name,
      async (event: CustomerCreatedEvent) => {
        console.log('CustomerCreatedEvent', event);
      },
    );
  }
}
