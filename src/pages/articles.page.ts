import { MainMenuComponent } from '../components/main-menu.component';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  mainMenu = new MainMenuComponent(this.page);
  searchInput: Locator;
  goSearchButton: Locator;
  noResultText: Locator;
  constructor(page: Page) {
    super(page);
    this.searchInput = this.page.getByTestId('search-input');
    this.goSearchButton = this.page.getByTestId('search-button');
    this.noResultText = this.page.getByTestId('no-results');
  }

  async gotoArticle(title: string): Promise<void> {
    await this.page.getByText(title).click();
  }

  async searchArticle(phrase: string): Promise<void> {
    await this.searchInput.fill(phrase);
    await this.goSearchButton.click();
  }
}
