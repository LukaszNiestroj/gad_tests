import { RegisterUserData } from '../models/user.model';
import { faker } from '@faker-js/faker';

export function randomUserData(): RegisterUserData {
  const registerUserData: RegisterUserData = {
    userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
    userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
    email: '',
    password: faker.internet.password(),
  };

  registerUserData.email = faker.internet.email({
    firstName: registerUserData.userFirstName,
    lastName: registerUserData.userLastName,
  });

  return registerUserData;
}
