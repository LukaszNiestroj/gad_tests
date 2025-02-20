import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentsPage } from '../../src/pages/comments.page';
import { HomePage } from '../../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify service main page', () => {
  test(
    'Home page Title',
    { tag: ['@GAD-R01-01', '@HomePage', '@smoke'] },
    async ({ page }) => {
      // Arrange
      const homePage = new HomePage(page);
      // Act
      await homePage.goto();
      // Assert
      const title = await homePage.getTitle();
      expect(title).toContain('GAD');
    },
  );

  test(
    'Articles page Title',
    { tag: ['@GAD-R01-02', '@smoke'] },
    async ({ page }) => {
      // Arrange
      const articlesPage = new ArticlesPage(page);
      // Act
      await articlesPage.goto();
      // Assert
      const title = await articlesPage.getTitle();
      expect(title).toContain('Articles');
    },
  );

  test(
    'Comments page Title',
    { tag: ['@GAD-R01-02', '@smoke'] },
    async ({ page }) => {
      // Arrange
      const commentsPage = new CommentsPage(page);
      // Act
      await commentsPage.goto();
      // Assert
      const title = await commentsPage.getTitle();
      expect(title).toContain('Comments');
    },
  );

  // test('Home page title simple', async ({ page }) => {
  //   // Act
  //   await page.goto('');
  //   // Assert
  //   await expect(page).toHaveTitle(/GAD/);
  // });
});
