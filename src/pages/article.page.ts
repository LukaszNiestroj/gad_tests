import { MainMenuComponent } from '@_src/components/main-menu.component';
import { BasePage } from '@_src/pages/base.page';
import { Locator, Page } from '@playwright/test';

interface ArticleComment {
  body: Locator;
  link: Locator;
}

export class ArticlePage extends BasePage {
  url = '/article.html';
  mainMenu = new MainMenuComponent(this.page);
  articleTitle: Locator;
  articleBody: Locator;
  deleteIcon: Locator;
  addCommentButton: Locator;
  alertPopup: Locator;
  constructor(page: Page) {
    super(page);
    this.articleTitle = this.page.getByTestId('article-title');
    this.articleBody = this.page.getByTestId('article-body');
    this.deleteIcon = this.page.getByTestId('delete');
    this.addCommentButton = this.page.locator('#add-new');
    this.alertPopup = this.page.getByTestId('alert-popup');
  }

  async deleteArticle(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    this.deleteIcon.click();
  }

  getArticleComment(body: string): ArticleComment {
    const commentContainer = this.page
      .locator('.comment-container.item-card')
      .filter({ hasText: body });

    return {
      link: commentContainer.locator("[id^='gotoComment']"),
      body: commentContainer.locator(':text("comment:") + span'),
    };
  }
}
