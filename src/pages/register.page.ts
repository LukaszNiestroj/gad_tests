import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class RegisterPage extends BasePage {
  url = '/register.html';
  userFirstNameInput: Locator;
  userLastNameInput: Locator;
  userEmailInput: Locator;
  userPasswordInput: Locator;
  registerButton: Locator;

  registerSuccessfulPopup: Locator;

  constructor(page: Page) {
    super(page);
    this.userFirstNameInput = this.page.getByTestId('firstname-input');
    this.userLastNameInput = this.page.getByTestId('lastname-input');
    this.userEmailInput = this.page.getByTestId('email-input');
    this.userPasswordInput = this.page.getByTestId('password-input');
    this.registerButton = this.page.getByTestId('register-button');

    this.registerSuccessfulPopup = this.page.getByTestId('alert-popup');
  }
  async register(
    userFirstName: string,
    userLastName: string,
    email: string,
    password: string,
  ): Promise<void> {
    await this.userFirstNameInput.fill(userFirstName);
    await this.userLastNameInput.fill(userLastName);
    await this.userEmailInput.fill(email);
    await this.userPasswordInput.fill(password);
    await this.registerButton.click();
  }
}
