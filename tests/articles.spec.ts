import { randomNewArticle } from '../src/factories/article.factory';
import { AddArticleModel } from '../src/models/article.model';
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
  let articleData: AddArticleModel;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticlesView = new AddArticlesView(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();

    articleData = randomNewArticle();

    await articlesPage.mainMenu.addArticleLogged.click();
    await expect.soft(addArticlesView.header).toBeVisible();
  });
  test(
    'create article with mandatory fields',
    { tag: ['@GAD-R04-01'] },
    async ({ page }) => {
      // Arrange
      const articlePage = new ArticlePage(page);

      // ACT
      await addArticlesView.createArticle(articleData);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);

      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'creating article with missing title text',
    { tag: ['@GAD-R04-01'] },
    async () => {
      // Arrange
      const articleErrorMessege = 'Article was not created';

      articleData.title = '';

      // ACT
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
    async () => {
      // Arrange
      const articleErrorMessege = 'Article was not created';
      articleData.body = '';

      // ACT
      await addArticlesView.createArticle(articleData);

      // Assert
      await expect(addArticlesView.articleErrorPopup).toContainText(
        articleErrorMessege,
      );
    },
  );
});
