import { pgConfig } from '../helpers/dbConfig';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { ProductFactory } from './products.factory';
import { MainSeeder } from './main.seeder';
import { Product } from '../products/products.entity';

const options: DataSourceOptions & SeederOptions = {
  ...pgConfig,
  entities: [Product],
  factories: [ProductFactory],
  seeds: [MainSeeder],
};

const datasource = new DataSource(options);

datasource
  .initialize()
  .then(async () => {
    console.info('Info: Synchronize data base and seeding data');
    await datasource.synchronize(true);
    await runSeeders(datasource);
    console.info('Info: Seed data created successfully');
    process.exit(1);
  })
  .catch((err) => {
    console.log(err);
  });
