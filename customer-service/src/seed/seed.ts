import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { CustomerFactory } from './customer.factory';
import { MainSeeder } from './main.seeder';
import { pgConfig } from '../helpers/pgConfig';
import { Customer } from '../customers/entities/customer.entity';

const options: DataSourceOptions & SeederOptions = {
  ...pgConfig,
  entities: [Customer],
  factories: [CustomerFactory],
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
