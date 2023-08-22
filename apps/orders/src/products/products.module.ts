import { Module, OnModuleInit } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from './entities/product.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Product } from './entities/product.entity';
import { DomainEventManager } from '@shared';
import { ProductCreatedEvent } from './domain-events/product-created.event';

@Module({
  imports: [MikroOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository],
  exports: [ProductsService, ProductRepository],
})
export class ProductsModule implements OnModuleInit {
  constructor(private readonly domainEventManager: DomainEventManager) {}

  onModuleInit() {
    this.domainEventManager.register(
      ProductCreatedEvent.name,
      async (event: ProductCreatedEvent) => {
        console.log('ProductCreatedEvent', event);
      },
    );
  }
}
