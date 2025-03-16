import { prepareRandomArticle } from '@_src/factories/article.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { ArticlesPage } from '@_src/pages/articles.page';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete articles', () => {
  let articlesPage: ArticlesPage;
  let articleData: AddArticleModel;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);

    await articlesPage.goto();
  });
  test(
    'create article with mandatory fields',
    { tag: ['@GAD-R04-01', '@logged'] },
    async () => {
      // Arrange
      articleData = prepareRandomArticle();

      // ACT
      const addArticlesView =
        await articlesPage.mainMenu.clickAddArticleButtonLogged();
      await expect.soft(addArticlesView.addNewHeader).toBeVisible();
      // await addArticlesView.createArticle(articleData);
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
    async () => {
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
    async () => {
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
