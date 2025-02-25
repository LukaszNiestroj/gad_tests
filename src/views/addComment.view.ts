import { Locator, Page } from '@playwright/test';

export class AddCommentView {
  bodyInput: Locator;
  saveButton: Locator;
  addNewHeader: Locator;
  constructor(private page: Page) {
    this.addNewHeader = this.page.getByRole('heading', {
      name: 'Add New Comment',
    });
    this.bodyInput = this.page.locator('#body');
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
  }
}
