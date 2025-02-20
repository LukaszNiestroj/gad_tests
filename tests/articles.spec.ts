import { randomNewArticle } from '../src/factories/article.factory';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user-data';
import { AddArticlesView } from '../src/views/addArticle.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticlesView: AddArticlesView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticlesView = new AddArticlesView(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();

    await articlesPage.mainMenu.addArticleLogged.click();
    await expect.soft(addArticlesView.addNewHeader).toBeVisible();
  });

  test(
    'creating article with missing title text',
    { tag: ['@GAD-R04-01'] },
    async () => {
      // Arrange
      const articleErrorMessage = 'Article was not created';
      const articleData = randomNewArticle();
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
    { tag: ['@GAD-R04-01'] },
    async () => {
      // Arrange
      const articleErrorMessage = 'Article was not created';
      const articleData = randomNewArticle();
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
      { tag: ['@GAD-R04-02'] },
      async () => {
        // Arrange
        const articleErrorMessage = 'Article was not created';
        const articleData = randomNewArticle(129);

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
      { tag: ['@GAD-R04-02'] },
      async ({ page }) => {
        // Arrange
        const articlePage = new ArticlePage(page);
        const articleData = randomNewArticle(128);

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
