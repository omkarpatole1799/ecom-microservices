import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { M_PRODUCT_NAME_REQUIRED } from 'src/helpers/response.message';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: M_PRODUCT_NAME_REQUIRED })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Product description is required' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Please enter price' })
  @IsPositive({ message: 'Product price should be positive' })
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Please enter product stock' })
  @IsPositive({ message: 'Product stock should be positive' })
  stock: number;
}
