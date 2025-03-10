import { prepareRandomArticle } from '../src/factories/article.factory';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { AddArticlesView } from '../src/views/addArticle.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let articlesPage: ArticlesPage;
  let addArticlesView: AddArticlesView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    addArticlesView = new AddArticlesView(page);

    await articlesPage.goto();

    await articlesPage.mainMenu.addArticleLogged.click();
    await expect.soft(addArticlesView.addNewHeader).toBeVisible();
  });

  test(
    'creating article with missing title text',
    { tag: ['@GAD-R04-01', '@logged'] },
    async () => {
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
    async () => {
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
      async () => {
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
      async ({ page }) => {
        // Arrange
        const articlePage = new ArticlePage(page);
        const articleData = prepareRandomArticle(128);

        // ACT
        await addArticlesView.createArticle(articleData);

        // Assert
        await expect
          .soft(articlePage.articleTitle)
          .toHaveText(articleData.title);
      },
    );
  });
});
