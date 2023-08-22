import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerRepository } from './entities/customer.repository';
import { ApplicationService } from '@shared';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    private customerRepo: CustomerRepository,
    private appService: ApplicationService,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    return this.appService.run(async () => {
      const customer = Customer.create({
        name: createCustomerDto.name,
        email: createCustomerDto.email,
        phone: createCustomerDto.phone,
        address: createCustomerDto.address,
      });
      this.customerRepo.add(customer);
      return customer;
    });
  }

  findAll() {
    return this.customerRepo.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
