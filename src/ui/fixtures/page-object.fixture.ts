import { ArticlePage } from '@_src/ui/pages/article.page';
import { ArticlesPage } from '@_src/ui/pages/articles.page';
import { CommentsPage } from '@_src/ui/pages/comments.page';
import { HomePage } from '@_src/ui/pages/home.page';
import { LoginPage } from '@_src/ui/pages/login.page';
import { RegisterPage } from '@_src/ui/pages/register.page';
import { AddArticlesView } from '@_src/ui/views/addArticle.view';
import { test as baseTest } from '@playwright/test';

interface Pages {
  addArticlesView: AddArticlesView;
  articlePage: ArticlePage;
  articlesPage: ArticlesPage;
  commentsPage: CommentsPage;
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
}

export const PageObjectTest = baseTest.extend<Pages>({
  addArticlesView: async ({ articlesPage }, use) => {
    const addArticlesView =
      await articlesPage.mainMenu.clickAddArticleButtonLogged();
    await use(addArticlesView);
  },
  articlePage: async ({ page }, use) => {
    const articlePage = new ArticlePage(page);
    await use(articlePage);
  },
  articlesPage: async ({ page }, use) => {
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await use(articlesPage);
  },
  commentsPage: async ({ page }, use) => {
    const commentsPage = new CommentsPage(page);
    await commentsPage.goto();
    await use(commentsPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await use(registerPage);
  },
});
