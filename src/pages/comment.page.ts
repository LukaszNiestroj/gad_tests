import { MainMenuComponent } from '@_src/components/main-menu.component';
import { ArticlePage } from '@_src/pages/article.page';
import { BasePage } from '@_src/pages/base.page';
import { EditCommentView } from '@_src/views/editComment.view';
import { Locator, Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu = new MainMenuComponent(this.page);
  commentBody: Locator;
  editButton: Locator;
  alertPopup: Locator;
  returnLink: Locator;
  constructor(page: Page) {
    super(page);
    this.commentBody = this.page.getByTestId('comment-body');
    this.editButton = this.page.getByTestId('edit');
    this.alertPopup = this.page.getByTestId('alert-popup');
    this.returnLink = this.page.getByTestId('return');
  }

  async clickEditButton(): Promise<EditCommentView> {
    await this.editButton.click();
    return new EditCommentView(this.page);
  }

  async clickReturnLink(): Promise<ArticlePage>{
    await this.returnLink.click();
    return new ArticlePage(this.page);
  }
}
