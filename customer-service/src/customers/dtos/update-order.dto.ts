import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  status: string;
}
