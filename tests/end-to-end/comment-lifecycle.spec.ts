import { prepareRandomArticle } from '../../src/factories/article.factory';
import { prepareRandomComment } from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user-data';
import { AddArticlesView } from '../../src/views/addArticle.view';
import { AddCommentView } from '../../src/views/addComment.view';
import { EditCommentView } from '../../src/views/editComment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addArticlesView: AddArticlesView;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;
  let editCommentView: EditCommentView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlePage = new ArticlePage(page);
    articlesPage = new ArticlesPage(page);
    addArticlesView = new AddArticlesView(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);

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
    const expectedCommentCreatedPopup = 'Comment was created';
    const newCommentData = prepareRandomComment();
    const expectedCommentUpdatedPopup = 'Comment was updated';

    // ACT
    await articlePage.addCommentButton.click();
    await expect(addCommentView.addNewHeader).toHaveText(
      expectedAddCommentHeader,
    );
    await addCommentView.createComment(newCommentData);

    // Assert
    await expect(articlePage.alertPopup).toHaveText(
      expectedCommentCreatedPopup,
    );
    // Verify new comment
    // ACT
    const articleComment = articlePage.getArticleComment(newCommentData.body);
    await expect(articleComment.body).toHaveText(newCommentData.body);

    await articleComment.link.click();

    // Assert
    await expect(commentPage.commentBody).toHaveText(newCommentData.body);

    // Edit comment
    // Arrange
    const editCommentData = prepareRandomComment();

    // ACT
    await commentPage.editButton.click();
    await editCommentView.updateComment(editCommentData);
    // Assert
    await expect(commentPage.commentBody).toHaveText(editCommentData.body);
    await expect(commentPage.alertPopup).toHaveText(
      expectedCommentUpdatedPopup,
    );
    await commentPage.returnLink.click();
    const updatedArticleComment = articlePage.getArticleComment(
      editCommentData.body,
    );
    await expect(updatedArticleComment.body).toHaveText(editCommentData.body);
  });
});
