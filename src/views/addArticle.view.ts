import { AddArticleModel } from '../models/article.model';
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

  async createArticle(addArticle: AddArticleModel): Promise<void> {
    await this.articleTitleInput.fill(addArticle.title);
    await this.articleBodyInput.fill(addArticle.body);
    await this.saveButton.click();
  }
}
