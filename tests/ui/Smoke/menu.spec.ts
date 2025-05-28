import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify menu main buttons', () => {
  test(
    'Comments button navigates to comments page',
    { tag: ['@GAD-R01-03', '@smoke'] },
    async ({ articlesPage }) => {
      // Arrange
      const expectedCommentsTitle = 'Comments';
      // Act
      const commentsPage = await articlesPage.mainMenu.clickCommentsButton();
      const title = await commentsPage.getTitle();
      // Assert
      expect(title).toContain(expectedCommentsTitle);
    },
  );

  test(
    'Articles button navigates to articles page',
    { tag: ['@GAD-R01-03', '@smoke'] },
    async ({ commentsPage }) => {
      // Arrange
      const expectedArticlesTitle = 'Articles';
      // Act
      const articlesPage = await commentsPage.mainMenu.clickArticlesButton();
      const title = await articlesPage.getTitle();
      // Assert
      expect(title).toContain(expectedArticlesTitle);
    },
  );

  test(
    'Home page button navigates to main page',
    { tag: ['@GAD-R01-03', '@smoke'] },
    async ({ articlesPage }) => {
      // Arrange
      const expectedHomePageTitle = 'GAD';
      // Act
      const homePage = await articlesPage.mainMenu.clickHomePageLink();
      const title = await homePage.getTitle();
      // Assert
      expect(title).toContain(expectedHomePageTitle);
    },
  );
});
