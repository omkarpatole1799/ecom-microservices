import { Product } from '../products/products.entity';
import { setSeederFactory } from 'typeorm-extension';

export const ProductFactory = setSeederFactory(Product, (faker) => {
  const product = new Product();

  product.name = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.price = faker.number.float({ max: 100 });
  product.stock = faker.number.int({ max: 100 });
  //   product.price = +faker.commerce.price({ max: 10, min: 1 });
  //   product.stock = +faker.commerce.price({ max: 10, min: 1 });

  return product;
});
