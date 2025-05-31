import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'product_order_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
