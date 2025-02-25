import { prepareRandomArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user-data';
import { AddArticlesView } from '../../src/views/addArticle.view';
import { AddCommentView } from '../../src/views/addComment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addArticlesView: AddArticlesView;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlePage = new ArticlePage(page);
    articlesPage = new ArticlesPage(page);
    addArticlesView = new AddArticlesView(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);

    articleData = prepareRandomArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.mainMenu.addArticleLogged.click();
    await addArticlesView.createArticle(articleData);
  });
  test('create new comment', { tag: ['@GAD-R05-01'] }, async ({}) => {
    // Create new comment
    // Arrange
    const expectedAddCommentHeader = 'Add New Comment';
    const newCommentText = 'Hello';
    const expectedCommentCreatedPopup = 'Comment was created';

    // ACT
    await articlePage.addCommentButton.click();
    await expect(addCommentView.addNewHeader).toHaveText(
      expectedAddCommentHeader,
    );
    await addCommentView.bodyInput.fill(newCommentText);
    await addCommentView.saveButton.click();

    // Assert
    await expect(articlePage.alertPopup).toHaveText(
      expectedCommentCreatedPopup,
    );
    // await page.getByText('asdasd', { exact: true }).click();
    // Verify new comment
    // ACT
    const articleComment = articlePage.getArticleComment(newCommentText);
    await expect(articleComment.body).toHaveText(newCommentText);

    await articleComment.link.click();

    // Assert
    await expect(commentPage.commentBody).toHaveText(newCommentText);
  });
});
