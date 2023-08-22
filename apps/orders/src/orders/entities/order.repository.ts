import { IRepository } from '@shared';
import { Order } from './order.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderRepository implements IRepository<Order> {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Order): Promise<void> {
    this.entityManager.persist(entity);
  }

  findById(id: string): Promise<Order> {
    return this.entityManager.findOne(Order, id);
  }

  findAll(): Promise<Order[]> {
    return this.entityManager.find(Order, {});
  }

  async delete(entity: Order): Promise<void> {
    await this.entityManager.remove(entity);
  }
}
