import { MainMenuComponent } from '@_src/ui/components/main-menu.component';
import { ArticlesPage } from '@_src/ui/pages/articles.page';
import { BasePage } from '@_src/ui/pages/base.page';
import { CommentPage } from '@_src/ui/pages/comment.page';
import { AddCommentView } from '@_src/ui/views/addComment.view';
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

  async clickAddCommentButton(): Promise<AddCommentView> {
    await this.addCommentButton.click();
    return new AddCommentView(this.page);
  }

  async deleteArticle(): Promise<ArticlesPage> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    this.deleteIcon.click();

    return new ArticlesPage(this.page);
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

  async clickCommentLink(
    commentContainer: ArticleComment,
  ): Promise<CommentPage> {
    await commentContainer.link.click();
    return new CommentPage(this.page);
  }
}
