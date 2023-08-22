export class CreateOrderDto {
  customer_id: string;
  items: { product_id: string; quantity: number }[];
}
