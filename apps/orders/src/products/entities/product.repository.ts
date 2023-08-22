import { IRepository } from '@shared';
import { Product } from './product.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository implements IRepository<Product> {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Product): Promise<void> {
    this.entityManager.persist(entity);
  }

  findById(id: string): Promise<Product> {
    return this.entityManager.findOne(Product, id);
  }

  findByIds(ids: string[]): Promise<Product[]> {
    return this.entityManager.find(Product, { id: { $in: ids } });
  }

  findAll(): Promise<Product[]> {
    return this.entityManager.find(Product, {});
  }

  async delete(entity: Product): Promise<void> {
    await this.entityManager.remove(entity);
  }
}
