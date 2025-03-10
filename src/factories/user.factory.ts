import { RegisterUserModel } from '@_src/models/user.model';
import { faker } from '@faker-js/faker';

export function prepareRandomUser(): RegisterUserModel {
  const registerUserData: RegisterUserModel = {
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
