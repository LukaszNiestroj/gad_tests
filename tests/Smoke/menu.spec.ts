import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentsPage } from '../../src/pages/comments.page';
import { HomePage } from '../../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main buttons', () => {
  test(
    'Comments button navigates to comments page',
    { tag: ['@GAD-R01-03', '@smoke'] },
    async ({ page }) => {
      // Arrange
      const articlesPage = new ArticlesPage(page);
      const commentsPage = new CommentsPage(page);
      // Act
      await articlesPage.goto();
      await articlesPage.mainMenu.commentsButton.click();
      const title = await commentsPage.getTitle();
      // Assert
      expect(title).toContain('Comments');
    },
  );

  test(
    'Articles button navigates to articles page',
    { tag: ['@GAD-R01-03', '@smoke'] },
    async ({ page }) => {
      // Arrange
      const articlesPage = new ArticlesPage(page);
      const commentsPage = new CommentsPage(page);
      // Act
      await commentsPage.goto();
      await commentsPage.mainMenu.articlesButton.click();
      const title = await articlesPage.getTitle();
      // Assert
      expect(title).toContain('Articles');
    },
  );

  test(
    'Home page button navigates to main page',
    { tag: ['@GAD-R01-03', '@smoke'] },
    async ({ page }) => {
      // Arrange
      const articlesPage = new ArticlesPage(page);
      const homePage = new HomePage(page);
      // Act
      await articlesPage.goto();
      await articlesPage.mainMenu.homePage.click();
      const title = await homePage.getTitle();
      // Assert
      expect(title).toContain('GAD');
    },
  );
});
