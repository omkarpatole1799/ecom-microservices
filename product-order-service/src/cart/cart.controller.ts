import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-car.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':id')
  async getCart(@Param('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add/:id')
  async addToCart(@Param('id') userId: string, @Body() body: AddToCartDto) {
    console.log(userId, '=id');
    console.log(body, '--body');

    return this.cartService.addToCart(userId, body.productId, body.quantity);
  }

  @Post('update/:id')
  async updateQuantity(
    @Param('id') userId: string,
    @Body()
    body: {
      quantity: number;
      productId: string;
      type: 'ADD_ITEM' | 'REMOVE_ITEM';
    },
  ) {
    console.log(body, '--body');
    return this.cartService.updateQuantity(
      userId,
      body.productId,
      body.quantity,
      body.type,
    );
  }

  // This will remove the item from cart
  @Delete(':id/:productId')
  async removeFromCart(
    @Param('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Delete(':id')
  async clearCart(@Param('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
