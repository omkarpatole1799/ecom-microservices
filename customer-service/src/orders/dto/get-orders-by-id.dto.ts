import { IsNotEmpty, IsString } from 'class-validator';

export class GetOrderByIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
