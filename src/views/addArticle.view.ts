import { AddArticleModel } from '@_src/models/article.model';
import { ArticlePage } from '@_src/pages/article.page';
import { Locator, Page } from '@playwright/test';

export class AddArticlesView {
  articleTitleInput: Locator;
  articleBodyInput: Locator;
  saveButton: Locator;
  addNewHeader: Locator;
  articleErrorPopup: Locator;
  constructor(private page: Page) {
    this.addNewHeader = this.page.getByRole('heading', {
      name: 'Add New Entry',
    });
    this.articleTitleInput = this.page.getByTestId('title-input');
    this.articleBodyInput = this.page.getByTestId('body-text');
    this.saveButton = this.page.getByTestId('save');
    this.articleErrorPopup = this.page.getByTestId('alert-popup');
  }

  async createArticle(addArticle: AddArticleModel): Promise<ArticlePage> {
    await this.articleTitleInput.fill(addArticle.title);
    await this.articleBodyInput.fill(addArticle.body);
    await this.saveButton.click();

    return new ArticlePage(this.page);
  }
}
