import { LoginUserModel } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { testUser1 } from '../src/test-data/user-data';
import { expect, test } from '@playwright/test';

test.describe('Verify user login', () => {
  test(
    'login with correct credentials',
    { tag: ['@GAD-R02-01', '@login'] },
    async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);

      // ACT
      await loginPage.goto();
      await loginPage.login(testUser1);
      const welcomePage = new WelcomePage(page);
      const title = await welcomePage.getTitle();

      // Assert
      expect(title).toContain('Welcome');
    },
  );

  test(
    'reject login with incorrect password',
    { tag: ['@GAD-R02-01', '@login'] },
    async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);

      const loginUserData: LoginUserModel = {
        userEmail: testUser1.userEmail,
        userPassword: 'incorrectPass',
      };

      // ACT
      await loginPage.goto();
      await loginPage.login(loginUserData);
      const title = await loginPage.getTitle();

      // Assert
      await expect
        .soft(loginPage.loginError)
        .toHaveText('Invalid username or password');
      expect.soft(title).toContain('Login');
    },
  );
});
