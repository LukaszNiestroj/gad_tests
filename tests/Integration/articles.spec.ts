import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { waitForResponse } from '@_src/utils/wait.util';

test.describe('Verify articles', () => {
  test(
    'creating article with missing title text',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticlesView, page }) => {
      // Arrange
      const articleErrorMessage = 'Article was not created';
      const expectedResponseCode = 422;
      const articleData = prepareRandomArticle();
      articleData.title = '';

      const responsePromise = waitForResponse(page, '/api/articles');

      // ACT
      await addArticlesView.createArticle(articleData);
      const response = await responsePromise;

      // Assert
      await expect(addArticlesView.articleErrorPopup).toContainText(
        articleErrorMessage,
      );
      expect(response.status()).toBe(expectedResponseCode);
    },
  );

  test(
    'creating article with missing body text',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticlesView, page }) => {
      // Arrange
      const articleErrorMessage = 'Article was not created';
      const expectedResponseCode = 422;
      const articleData = prepareRandomArticle();
      articleData.body = '';

      const responsePromise = waitForResponse(page, '/api/articles');

      // ACT
      await addArticlesView.createArticle(articleData);
      const response = await responsePromise;

      // Assert
      await expect(addArticlesView.articleErrorPopup).toContainText(
        articleErrorMessage,
      );
      expect(response.status()).toBe(expectedResponseCode);
    },
  );

  test.describe('Title length', () => {
    test(
      'creating article with title exceeding 128 signs',
      { tag: ['@GAD-R04-02', '@logged'] },
      async ({ addArticlesView, page }) => {
        // Arrange
        const articleErrorMessage = 'Article was not created';
        const articleData = prepareRandomArticle(129);
        const expectedResponseCode = 422;

        const responsePromise = waitForResponse(page, '/api/articles');

        // ACT
        await addArticlesView.createArticle(articleData);
        const response = await responsePromise;

        // Assert
        await expect(addArticlesView.articleErrorPopup).toContainText(
          articleErrorMessage,
        );
        expect(response.status()).toBe(expectedResponseCode);
      },
    );

    test(
      'creating article with title 128 signs',
      { tag: ['@GAD-R04-02', '@logged'] },
      async ({ addArticlesView, page }) => {
        // Arrange
        const articleData = prepareRandomArticle(128);
        const expectedResponseCode = 201;

        const responsePromise = waitForResponse(page, '/api/articles');

        // ACT
        const articlePage = await addArticlesView.createArticle(articleData);
        const response = await responsePromise;

        // Assert
        await expect
          .soft(articlePage.articleTitle)
          .toHaveText(articleData.title);
        expect(response.status()).toBe(expectedResponseCode);
      },
    );
  });
});
