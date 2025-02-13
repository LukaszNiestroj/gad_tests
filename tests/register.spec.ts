import { RegisterUserData } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test(
    'register with correct data and login',
    { tag: ['@GAD-R02-01', '@GAD-R02-03', '@GAD-R02-03', '@register'] },
    async ({ page }) => {
      // Arrange
      const registerPage = new RegisterPage(page);
      const expectedAlertPopUp = 'User created';

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

      // Act
      await registerPage.goto();
      await registerPage.register(registerUserData);

      // Assert
      await expect(registerPage.registerSuccessfulPopup).toHaveText(
        expectedAlertPopUp,
      );
      const loginPage = new LoginPage(page);
      await loginPage.waitForPageLoadUrl();
      const titleLogin = await loginPage.title();
      expect.soft(titleLogin).toContain('Login');

      //Assert
      await loginPage.login({
        userEmail: registerUserData.email,
        userPassword: registerUserData.password,
      });
      const welcomePage = new WelcomePage(page);
      const titleAfterLogin = await welcomePage.title();
      expect(titleAfterLogin).toContain('Welcome');
    },
  );
});
