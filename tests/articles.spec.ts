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
      await loginPage.goto();
      await loginPage.login(testUser1);

      const articlesPage = new ArticlesPage(page);
      await articlesPage.goto();
      // ACT
      await articlesPage.mainMenu.addArticleLogged.click();

      const addArticlesView = new AddArticlesView(page);
      await expect.soft(addArticlesView.header).toBeVisible();

      const newArticleTitle = 'Testing title';
      const newArticleBody = 'Lorem Ipsum testing body';

      await addArticlesView.articleTitleInput.fill(newArticleTitle);
      await addArticlesView.articleBodyInput.fill(newArticleBody);
      await addArticlesView.saveButton.click();

      // Assert
      const articlePage = new ArticlePage(page);
      await expect.soft(articlePage.articleTitle).toHaveText(newArticleTitle);
      await expect.soft(articlePage.articleBody).toHaveText(newArticleBody);
    },
  );
});
