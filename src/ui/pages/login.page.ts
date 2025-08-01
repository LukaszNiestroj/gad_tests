import { LoginUserModel } from '@_src/ui/models/user.model';
import { BasePage } from '@_src/ui/pages/base.page';
import { WelcomePage } from '@_src/ui/pages/welcome.page';
import { Locator, Page } from '@playwright/test';

export class LoginPage extends BasePage {
  url = '/login/';
  userEmailInput: Locator;
  userPasswordInput: Locator;
  loginButton: Locator;

  loginError: Locator;

  constructor(page: Page) {
    super(page);
    this.loginError = this.page.getByTestId('login-error');
    this.userEmailInput = this.page.getByRole('textbox', {
      name: 'Enter User Email',
    });
    this.userPasswordInput = this.page.getByRole('textbox', {
      name: 'Enter Password',
    });
    this.loginButton = this.page.getByRole('button', { name: 'LogIn' });
  }

  async login(loginUserData: LoginUserModel): Promise<WelcomePage> {
    await this.userEmailInput.fill(loginUserData.userEmail);
    await this.userPasswordInput.fill(loginUserData.userPassword);
    await this.loginButton.click();

    return new WelcomePage(this.page);
  }
}
