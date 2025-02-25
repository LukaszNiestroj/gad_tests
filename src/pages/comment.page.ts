import { MainMenuComponent } from '../components/main-menu.component';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu = new MainMenuComponent(this.page);
  commentBody: Locator;
  constructor(page: Page) {
    super(page);
    this.commentBody = this.page.getByTestId('comment-body');
  }
}
