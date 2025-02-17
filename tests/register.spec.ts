import { randomUserData } from '../src/factories/user.factory';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test(
    'register with correct data and login',
    { tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03', '@register'] },
    async ({ page }) => {
      // Arrange
      const registerPage = new RegisterPage(page);
      const expectedAlertPopUp = 'User created';

      const registerUserData = randomUserData();

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

      const registerUserData = randomUserData();
      registerUserData.email = '!@#$';

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
      const registerUserData = randomUserData();
      const registerPage = new RegisterPage(page);
      const expectedErrorMessage = 'This field is required';

      // Act
      await registerPage.goto();
      await registerPage.userFirstNameInput.fill(
        registerUserData.userFirstName,
      );
      await registerPage.userLastNameInput.fill(registerUserData.userLastName);
      await registerPage.userPasswordInput.fill(registerUserData.password);
      await registerPage.registerButton.click();

      // Assert
      await expect(registerPage.emailErrorText).toHaveText(
        expectedErrorMessage,
      );
    },
  );
});
