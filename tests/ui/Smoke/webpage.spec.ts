import { expect, test } from '@_src/merge.fixture';

test.describe('Verify service main page', () => {
  test(
    'Home page Title',
    { tag: ['@GAD-R01-01', '@HomePage', '@smoke'] },
    async ({ homePage }) => {
      // Arrange
      const expectedHomePageTitle = 'GAD';

      // Assert
      const title = await homePage.getTitle();
      expect(title).toContain(expectedHomePageTitle);
    },
  );

  test(
    'Articles page Title',
    { tag: ['@GAD-R01-02', '@smoke'] },
    async ({ articlesPage }) => {
      // Arrange
      const expectedArticlesTitle = 'Articles';
      // Assert
      const title = await articlesPage.getTitle();
      expect(title).toContain(expectedArticlesTitle);
    },
  );

  test(
    'Comments page Title',
    { tag: ['@GAD-R01-02', '@smoke'] },
    async ({ commentsPage }) => {
      // Arrange
      const expectedCommentsTitle = 'Comments';
      // Assert
      const title = await commentsPage.getTitle();
      expect(title).toContain(expectedCommentsTitle);
    },
  );

  test('Home page title simple', async ({ page }) => {
    // Act
    await page.goto('');
    // Assert
    await expect(page).toHaveTitle(/GAD/);
  });
});
