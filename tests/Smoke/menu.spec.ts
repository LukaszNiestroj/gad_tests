import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main buttons', () => {
  test(
    'Comments button navigates to comments page',
    { tag: ['@GAD-R01-03', '@smoke'] },
    async ({ page }) => {
      // Arrange
      const articlesPage = new ArticlesPage(page);
      const expectedCommentsTitle = 'Comments';
      // Act
      await articlesPage.goto();
      const commentsPage = await articlesPage.mainMenu.clickCommentsButton();
      const title = await commentsPage.getTitle();
      // Assert
      expect(title).toContain(expectedCommentsTitle);
    },
  );

  test(
    'Articles button navigates to articles page',
    { tag: ['@GAD-R01-03', '@smoke'] },
    async ({ page }) => {
      // Arrange
      const commentsPage = new CommentsPage(page);
      const expectedArticlesTitle = 'Articles';
      // Act
      await commentsPage.goto();
      const articlesPage = await commentsPage.mainMenu.clickArticlesButton();
      const title = await articlesPage.getTitle();
      // Assert
      expect(title).toContain(expectedArticlesTitle);
    },
  );

  test(
    'Home page button navigates to main page',
    { tag: ['@GAD-R01-03', '@smoke'] },
    async ({ page }) => {
      // Arrange
      const articlesPage = new ArticlesPage(page);
      const expectedHomePageTitle = 'GAD';
      // Act
      await articlesPage.goto();
      const homePage = await articlesPage.mainMenu.clickHomePageLink();
      const title = await homePage.getTitle();
      // Assert
      expect(title).toContain(expectedHomePageTitle);
    },
  );
});
