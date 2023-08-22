import { IRepository } from '@shared';
import { Customer } from './customer.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerRepository implements IRepository<Customer> {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Customer): Promise<void> {
    this.entityManager.persist(entity);
  }

  findById(id: string): Promise<Customer> {
    return this.entityManager.findOne(Customer, id);
  }

  findAll(): Promise<Customer[]> {
    return this.entityManager.find(Customer, {});
  }

  async delete(entity: Customer): Promise<void> {
    await this.entityManager.remove(entity);
  }
}
