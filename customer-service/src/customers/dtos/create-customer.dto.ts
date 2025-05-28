// src/customers/dto/create-customer.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter valid mobile number' })
  phone: string;
}
