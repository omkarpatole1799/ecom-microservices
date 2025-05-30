import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsString,
} from 'class-validator';
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

  @IsNotEmpty({ message: 'Please enter valid address' })
  address: string;

  @IsNotEmpty({ message: 'Please enter valid name' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter valid mobile number' })
  phone: string;
}
