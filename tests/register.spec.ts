import { RegisterUserData } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test(
    'register with correct data and login',
    { tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03', '@register'] },
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

  test(
    'Not register with incorrect data - not valid email',
    { tag: ['@GAD-R03-04', '@register'] },
    async ({ page }) => {
      // Arrange
      const registerPage = new RegisterPage(page);
      const expectedErrorMessage = 'Please provide a valid email address';

      const registerUserData: RegisterUserData = {
        userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
        userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
        email: '!@#$',
        password: faker.internet.password(),
      };

      // Act
      await registerPage.goto();
      await registerPage.register(registerUserData);

      // Assert
      await expect(registerPage.emailErrorText).toHaveText(
        expectedErrorMessage,
      );
    },
  );

  test(
    'Not register with incorrect data - email not provided',
    { tag: ['@GAD-R03-04', '@register'] },
    async ({ page }) => {
      // Arrange
      const registerPage = new RegisterPage(page);
      const expectedErrorMessage = 'This field is required';
      // Act
      await registerPage.goto();
      await registerPage.userFirstNameInput.fill(
        faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      );
      await registerPage.userLastNameInput.fill(
        faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      );
      await registerPage.userPasswordInput.fill(faker.internet.password());
      await registerPage.registerButton.click();

      // Assert
      await expect(registerPage.emailErrorText).toHaveText(
        expectedErrorMessage,
      );
    },
  );
});
