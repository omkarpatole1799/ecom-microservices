import { Customer } from '../customers/entities/customer.entity';
import { setSeederFactory } from 'typeorm-extension';

export const CustomerFactory = setSeederFactory(Customer, (faker) => {
  const customer = new Customer();

  // customer.name = faker.person.fullName({ sex: 'male' });
  // customer.email = faker.internet.email();
  customer.address = faker.location.streetAddress();
  customer.password = faker.internet.password();

  customer.name = 'Omkar';
  customer.email = 'omkar@gmail.com';
  customer.phone = '7020235565';

  return customer;
});
