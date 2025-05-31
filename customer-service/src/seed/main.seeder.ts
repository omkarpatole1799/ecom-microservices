import { Customer } from '../customers/entities/customer.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    const customerFactory = factoryManager.get(Customer);

    console.log('Info: Creating users');
    const customer = await customerFactory.saveMany(10);
  }
}
