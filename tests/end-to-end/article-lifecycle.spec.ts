import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { AddArticleModel } from '@_src/models/article.model';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete articles', () => {
  let articleData: AddArticleModel;

  test(
    'create article with mandatory fields',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticlesView }) => {
      // Arrange
      articleData = prepareRandomArticle();

      // Act
      const articlePage = await addArticlesView.createArticle(articleData);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);

      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'user can access single article',
    { tag: ['@GAD-R04-03', '@logged'] },
    async ({ articlesPage }) => {
      // ACT
      const articlePage = await articlesPage.gotoArticle(articleData.title);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);

      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'user can delete own article',
    { tag: ['@GAD-R04-04', '@logged'] },
    async ({ articlesPage }) => {
      // Arrange
      const articlePage = await articlesPage.gotoArticle(articleData.title);
      const expectedArticlesTitle = 'Articles';
      const expectedNoResultText = 'No data';

      // Act
      articlesPage = await articlePage.deleteArticle();

      // Assert
      await articlesPage.waitForPageLoadUrl();
      const title = await articlesPage.getTitle();
      expect(title).toContain(expectedArticlesTitle);

      articlesPage = await articlesPage.searchArticle(articleData.title);
      await expect(articlesPage.noResultText).toHaveText(expectedNoResultText);
    },
  );
});
