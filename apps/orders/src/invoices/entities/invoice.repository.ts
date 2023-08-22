import { IRepository } from '@shared';
import { Invoice } from './invoice.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoiceRepository implements IRepository<Invoice> {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Invoice): Promise<void> {
    this.entityManager.persist(entity);
  }

  findById(id: string): Promise<Invoice> {
    return this.entityManager.findOne(Invoice, id);
  }

  findAll(): Promise<Invoice[]> {
    return this.entityManager.find(Invoice, {});
  }

  async delete(entity: Invoice): Promise<void> {
    await this.entityManager.remove(entity);
  }
}
