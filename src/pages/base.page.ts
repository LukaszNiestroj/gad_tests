import { Page } from '@playwright/test';

export class BasePage {
  url = '';
  constructor(protected page: Page) {}

  async goto(parameters = ''): Promise<void> {
    await this.page.goto(`${this.url}${parameters}`);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForPageLoadUrl(): Promise<void> {
    await this.page.waitForURL(this.url);
  }
}
