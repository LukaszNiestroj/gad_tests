import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test(
    'register with correct data and login',
    { tag: ['@GAD-R02-01', '@GAD-R02-03', '@GAD-R02-03', '@register'] },
    async ({ page }) => {
      // Arrange
      const registerPage = new RegisterPage(page);
      const userFirstName = faker.person.firstName();
      const userLastName = faker.person.lastName();
      const email = faker.internet.email({
        firstName: userFirstName,
        lastName: userLastName,
      });
      const password = faker.internet.password();
      const expectedAlertPopUp = 'User created';

      // Act
      await registerPage.goto();
      await registerPage.register(userFirstName, userLastName, email, password);
      // Assert
      await expect(registerPage.registerSuccessfulPopup).toHaveText(
        expectedAlertPopUp,
      );
      const loginPage = new LoginPage(page);
      await loginPage.waitForPageLoadUrl();
      const titleLogin = await loginPage.title();
      expect.soft(titleLogin).toContain('Login');

      //Assert
      await loginPage.login(email, password);
      const welcomePage = new WelcomePage(page);
      const titleAfterLogin = await welcomePage.title();
      // await loginPage.waitForPageLoadUrl();
      expect(titleAfterLogin).toContain('Welcome');
    },
  );
});
