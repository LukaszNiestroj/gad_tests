import { ArticlesPage } from '@_src/ui/pages/articles.page';
import { CommentsPage } from '@_src/ui/pages/comments.page';
import { HomePage } from '@_src/ui/pages/home.page';
import { AddArticlesView } from '@_src/ui/views/addArticle.view';
import { Locator, Page } from '@playwright/test';

export class MainMenuComponent {
  commentsButton: Locator;
  articlesButton: Locator;
  homePageLink: Locator;
  addArticleButtonLogged: Locator;

  constructor(private page: Page) {
    this.commentsButton = this.page.getByTestId('open-comments');
    this.articlesButton = this.page.getByTestId('open-articles');
    this.homePageLink = this.page.getByRole('link', { name: '🦎 GAD' });
    this.addArticleButtonLogged = this.page.locator('#add-new');
  }

  async clickAddArticleButtonLogged(): Promise<AddArticlesView> {
    await this.addArticleButtonLogged.click();
    return new AddArticlesView(this.page);
  }

  async clickCommentsButton(): Promise<CommentsPage> {
    await this.commentsButton.click();
    return new CommentsPage(this.page);
  }

  async clickArticlesButton(): Promise<ArticlesPage> {
    await this.articlesButton.click();
    return new ArticlesPage(this.page);
  }

  async clickHomePageLink(): Promise<HomePage> {
    await this.homePageLink.click();
    return new HomePage(this.page);
  }
}
