import { MainMenuComponent } from '@_src/ui/components/main-menu.component';
import { ArticlePage } from '@_src/ui/pages/article.page';
import { BasePage } from '@_src/ui/pages/base.page';
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

  async gotoArticle(title: string): Promise<ArticlePage> {
    await this.page.getByText(title).click();
    return new ArticlePage(this.page);
  }

  async searchArticle(phrase: string): Promise<ArticlesPage> {
    await this.searchInput.fill(phrase);
    await this.goSearchButton.click();

    return this;
  }
}
