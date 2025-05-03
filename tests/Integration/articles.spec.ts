import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles', () => {
  test(
    'creating article with missing title text',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticlesView }) => {
      // Arrange
      const articleErrorMessage = 'Article was not created';
      const articleData = prepareRandomArticle();
      articleData.title = '';

      // ACT
      await addArticlesView.createArticle(articleData);

      // Assert
      await expect(addArticlesView.articleErrorPopup).toContainText(
        articleErrorMessage,
      );
    },
  );

  test(
    'creating article with missing body text',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticlesView }) => {
      // Arrange
      const articleErrorMessage = 'Article was not created';
      const articleData = prepareRandomArticle();
      articleData.body = '';

      // ACT
      await addArticlesView.createArticle(articleData);

      // Assert
      await expect(addArticlesView.articleErrorPopup).toContainText(
        articleErrorMessage,
      );
    },
  );

  test.describe('Title length', () => {
    test(
      'creating article with title exceeding 128 signs',
      { tag: ['@GAD-R04-02', '@logged'] },
      async ({ addArticlesView }) => {
        // Arrange
        const articleErrorMessage = 'Article was not created';
        const articleData = prepareRandomArticle(129);

        // ACT
        await addArticlesView.createArticle(articleData);

        // Assert
        await expect(addArticlesView.articleErrorPopup).toContainText(
          articleErrorMessage,
        );
      },
    );

    test(
      'creating article with title 128 signs',
      { tag: ['@GAD-R04-02', '@logged'] },
      async ({ addArticlesView }) => {
        // Arrange
        const articleData = prepareRandomArticle(128);

        // ACT
        const articlePage = await addArticlesView.createArticle(articleData);

        // Assert
        await expect
          .soft(articlePage.articleTitle)
          .toHaveText(articleData.title);
      },
    );
  });
});
