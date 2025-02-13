import { RegisterUserData } from '../models/user.model';
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
  emailErrorText: Locator;

  constructor(page: Page) {
    super(page);
    this.userFirstNameInput = this.page.getByTestId('firstname-input');
    this.userLastNameInput = this.page.getByTestId('lastname-input');
    this.userEmailInput = this.page.getByTestId('email-input');
    this.userPasswordInput = this.page.getByTestId('password-input');
    this.registerButton = this.page.getByTestId('register-button');

    this.registerSuccessfulPopup = this.page.getByTestId('alert-popup');
    this.emailErrorText = this.page.locator('#octavalidate_email');
  }
  async register(registerUserData: RegisterUserData): Promise<void> {
    await this.userFirstNameInput.fill(registerUserData.userFirstName);
    await this.userLastNameInput.fill(registerUserData.userLastName);
    await this.userEmailInput.fill(registerUserData.email);
    await this.userPasswordInput.fill(registerUserData.password);
    await this.registerButton.click();
  }
}
