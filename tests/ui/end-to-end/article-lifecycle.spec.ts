import { expect, test } from '@_src/merge.fixture';
import { AddArticleModel } from '@_src/ui/models/article.model';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete articles', () => {
  let articleData: AddArticleModel;

  test(
    'create article with mandatory fields',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ createRandomArticle }) => {
      // Arrange
      articleData = createRandomArticle.articleData;

      // Act
      const articlePage = createRandomArticle.articlePage;

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
