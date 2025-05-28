import { IsUUID, IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}