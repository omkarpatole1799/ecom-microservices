import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
