// src/customers/dto/create-customer.dto.ts
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
