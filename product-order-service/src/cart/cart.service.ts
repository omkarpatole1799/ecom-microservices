import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart.entity';
import { Product } from 'src/products/products.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getCart(userId: string) {
    const cartItems = await this.cartItemRepository.find({
      where: { userId },
      relations: ['product'],
      order: {
        createdAt: 'DESC',
      },
    });

    return cartItems;
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    console.log(productId, '--productId');
    // Check product exists and has enough stock
    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });

      console.log(product, '--product');

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (product.stock < quantity) {
        throw new BadRequestException(`Only ${product.stock} items available`);
      }

      // Check if product already in cart
      let cartItem = await this.cartItemRepository.findOne({
        where: { userId, productId },
      });

      console.log(cartItem, '--cartItem');

      if (cartItem) {
        // Check if new total quantity exceeds stock
        if (quantity > product.stock) {
          throw new BadRequestException(
            `Cannot add more items. Only ${product.stock} available`,
          );
        }
        await this.cartItemRepository.update(cartItem.id, {
          quantity,
        });
      } else {
        cartItem = this.cartItemRepository.create({
          userId,
          productId,
          quantity,
        });
        await this.cartItemRepository.save(cartItem);
      }

      // update product stock
      await this.productRepository.update(productId, {
        stock: product.stock - quantity,
      });

      return this.getCart(userId);
    } catch (error) {
      console.log(error, '--error');
    }
  }

  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
    type: string,
  ) {
    console.log('in here');
    // Check product exists and has enough stock
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // for type "ADD_ITEM"
    if (type === 'ADD_ITEM') {
      if (product.stock < quantity) {
        throw new BadRequestException(`Only ${product.stock} items available`);
      }
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    const oldQuantity = cartItem.quantity;
    const quantityDiff = quantity - oldQuantity;

    if (quantity === 0) {
      await this.cartItemRepository.remove(cartItem);
    } else {
      cartItem.quantity = quantity;
      await this.cartItemRepository.update(cartItem.id, {
        quantity,
      });
    }

    // Update stock only if there is a change
    if (quantityDiff !== 0) {
      await this.productRepository.update(productId, {
        stock: product.stock - quantityDiff,
      });
    }

    // update product stock

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.cartItemRepository.remove(cartItem);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await this.cartItemRepository.delete({ userId });
    return [];
  }
}
