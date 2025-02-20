import { randomUserData } from '../src/factories/user.factory';
import { RegisterUserModel } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUserModel;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    registerUserData = randomUserData();
    await registerPage.goto();
  });
  test(
    'register with correct data and login',
    { tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03', '@register'] },
    async ({ page }) => {
      // Arrange
      const expectedAlertPopUp = 'User created';

      const loginPage = new LoginPage(page);
      const welcomePage = new WelcomePage(page);

      // Act
      await registerPage.register(registerUserData);

      // Assert
      await expect(registerPage.registerSuccessfulPopup).toHaveText(
        expectedAlertPopUp,
      );
      await loginPage.waitForPageLoadUrl();
      const titleLogin = await loginPage.title();
      expect.soft(titleLogin).toContain('Login');

      //Assert test login
      await loginPage.login({
        userEmail: registerUserData.email,
        userPassword: registerUserData.password,
      });
      const titleAfterLogin = await welcomePage.title();
      expect(titleAfterLogin).toContain('Welcome');
    },
  );

  test(
    'Not register with incorrect data - not valid email',
    { tag: ['@GAD-R03-04', '@register'] },
    async () => {
      // Arrange
      const expectedErrorMessage = 'Please provide a valid email address';

      registerUserData.email = '!@#$';

      // Act
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
    async () => {
      // Arrange
      const expectedErrorMessage = 'This field is required';

      // Act
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
