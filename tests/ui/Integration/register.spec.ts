import { expect, test } from '@_src/merge.fixture';
import { prepareRandomUser } from '@_src/ui/factories/user.factory';
import { RegisterUserModel } from '@_src/ui/models/user.model';

test.describe('Verify register', () => {
  let registerUserData: RegisterUserModel;

  test.beforeEach(async () => {
    registerUserData = prepareRandomUser();
  });
  test(
    'register with correct data and login',
    {
      tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03', '@register'],
    },
    async ({ registerPage }) => {
      // Arrange
      const expectedAlertPopUp = 'User created';
      const expectedLoginTitle = 'Login';
      const expectedWelcomeTitle = 'Welcome';

      // Act
      const loginPage = await registerPage.register(registerUserData);

      // Assert
      await expect(registerPage.registerSuccessfulPopup).toHaveText(
        expectedAlertPopUp,
      );
      await loginPage.waitForPageLoadUrl();
      const titleLogin = await loginPage.getTitle();
      expect.soft(titleLogin).toContain(expectedLoginTitle);

      //Assert test login
      const welcomePage = await loginPage.login({
        userEmail: registerUserData.email,
        userPassword: registerUserData.password,
      });
      const titleAfterLogin = await welcomePage.getTitle();
      expect(titleAfterLogin).toContain(expectedWelcomeTitle);
    },
  );

  test(
    'Not register with incorrect data - not valid email',
    { tag: ['@GAD-R03-04', '@register'] },
    async ({ registerPage }) => {
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
    async ({ registerPage }) => {
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
