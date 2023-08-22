import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './entities/product.repository';
import { ApplicationService } from '@shared';

@Injectable()
export class ProductsService {
  constructor(
    private productRepo: ProductRepository,
    private appService: ApplicationService,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this.appService.run(async () => {
      const product = Product.create({
        name: createProductDto.name,
        price: createProductDto.price,
        quantity: createProductDto.quantity,
      });
      this.productRepo.add(product);
      return product;
    });
  }

  findAll() {
    return this.productRepo.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
