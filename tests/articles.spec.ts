import { randomNewArticle } from '../src/factories/article.factory';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user-data';
import { AddArticlesView } from '../src/views/addArticle.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  test(
    'create article with mandatory fields',
    { tag: ['@GAD-R04-01'] },
    async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      const articlesPage = new ArticlesPage(page);
      const addArticlesView = new AddArticlesView(page);

      await loginPage.goto();
      await loginPage.login(testUser1);
      await articlesPage.goto();

      // ACT
      await articlesPage.mainMenu.addArticleLogged.click();
      await expect.soft(addArticlesView.header).toBeVisible();

      const articleData = randomNewArticle();
      await addArticlesView.createArticle(articleData);

      // Assert
      const articlePage = new ArticlePage(page);
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'creating article with missing title text',
    { tag: ['@GAD-R04-01'] },
    async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      const articlesPage = new ArticlesPage(page);
      const addArticlesView = new AddArticlesView(page);

      const articleData = randomNewArticle();
      articleData.title = '';
      const articleErrorMessege = 'Article was not created';

      await loginPage.goto();
      await loginPage.login(testUser1);
      await articlesPage.goto();
      // ACT
      await articlesPage.mainMenu.addArticleLogged.click();

      await expect.soft(addArticlesView.header).toBeVisible();

      await addArticlesView.createArticle(articleData);

      // Assert
      await expect(addArticlesView.articleErrorPopup).toContainText(
        articleErrorMessege,
      );
    },
  );

  test(
    'creating article with missing body text',
    { tag: ['@GAD-R04-01'] },
    async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      const articlesPage = new ArticlesPage(page);
      const addArticlesView = new AddArticlesView(page);

      const articleData = randomNewArticle();
      articleData.body = '';

      const articleErrorMessege = 'Article was not created';

      await loginPage.goto();
      await loginPage.login(testUser1);
      await articlesPage.goto();
      // ACT
      await articlesPage.mainMenu.addArticleLogged.click();

      await expect.soft(addArticlesView.header).toBeVisible();

      await addArticlesView.createArticle(articleData);

      // Assert
      await expect(addArticlesView.articleErrorPopup).toContainText(
        articleErrorMessege,
      );
    },
  );
});
