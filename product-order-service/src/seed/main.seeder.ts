import { Product } from '../products/products.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    const productFactory = factoryManager.get(Product);

    console.log('Info: Creating users');
    const products = await productFactory.saveMany(10);
  }
}
