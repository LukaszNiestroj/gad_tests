import { prepareRandomArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user-data';
import { AddArticlesView } from '../../src/views/addArticle.view';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete articles', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlePage = new ArticlePage(page);
    articlesPage = new ArticlesPage(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
  });
  test(
    'create article with mandatory fields',
    { tag: ['@GAD-R04-01'] },
    async ({ page }) => {
      // Arrange
      const addArticlesView = new AddArticlesView(page);

      articleData = prepareRandomArticle();

      // ACT
      await articlesPage.mainMenu.addArticleLogged.click();
      await expect.soft(addArticlesView.addNewHeader).toBeVisible();
      await addArticlesView.createArticle(articleData);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);

      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test('user can access single article', { tag: ['@GAD-R04-03'] }, async () => {
    // ACT
    await articlesPage.gotoArticle(articleData.title);

    // Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);

    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('user can delete own article', { tag: ['@GAD-R04-04'] }, async () => {
    // Arrange
    await articlesPage.gotoArticle(articleData.title);

    // Act
    await articlePage.deleteArticle();

    // Assert
    await articlesPage.waitForPageLoadUrl();
    const title = await articlesPage.getTitle();
    expect(title).toContain('Articles');

    await articlesPage.searchArticle(articleData.title);
    await expect(articlesPage.noResultText).toHaveText('No data');
  });
});
