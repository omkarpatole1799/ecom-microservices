import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { successResponse } from 'src/helpers/response.helper';
import { M_PRODUCT_CREATE_SUCCESS } from 'src/helpers/response.message';
import { Product } from './products.entity';
import { ApiResponse } from 'src/types/common';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.createProduct(createProductDto);
    return successResponse(product, M_PRODUCT_CREATE_SUCCESS);
  }

  @Get()
  async findAllProducts(): Promise<Product[]> {
    console.log('findAllProducts');
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.productService.deleteProduct(id);
    return successResponse(null, 'Successfully deleted');
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    console.log(id, '-id');
    return await this.productService.updateProduct(id, updateProductDto);
  }
}
