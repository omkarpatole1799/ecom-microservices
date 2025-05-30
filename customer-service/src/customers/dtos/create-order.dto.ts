import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  customerId: string;

  @IsNotEmpty()
  totalAmount: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  status: string;
}
