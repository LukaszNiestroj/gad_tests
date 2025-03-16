import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { AddCommentModel } from '@_src/models/comment.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { AddArticlesView } from '@_src/views/addArticle.view';
import { EditCommentView } from '@_src/views/editComment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let articlesPage: ArticlesPage;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addArticlesView: AddArticlesView;
  let editCommentView: EditCommentView;

  test.beforeEach(async ({ page }) => {
    articlePage = new ArticlePage(page);
    articlesPage = new ArticlesPage(page);
    addArticlesView = new AddArticlesView(page);
    editCommentView = new EditCommentView(page);

    articleData = prepareRandomArticle();

    await articlesPage.goto();
    await articlesPage.mainMenu.addArticleLogged.click();
    await addArticlesView.createArticle(articleData);
  });
  test(
    'Operate on comment',
    { tag: ['@GAD-R05-01', '@GAD-R05-02', '@logged'] },
    async () => {
      // Arrange
      const newCommentData = prepareRandomComment();

      // ACT
      await test.step('Create new comment', async () => {
        // Arrange
        const expectedAddCommentHeader = 'Add New Comment';
        const expectedCommentCreatedPopup = 'Comment was created';

        // ACT
        const addCommentView = await articlePage.clickCommentButton();
        await expect
          .soft(addCommentView.addNewHeader)
          .toHaveText(expectedAddCommentHeader);
        await addCommentView.createComment(newCommentData);

        // Assert
        await expect
          .soft(articlePage.alertPopup)
          .toHaveText(expectedCommentCreatedPopup);
      });

      const commentPage = await test.step('Verify comment', async () => {
        // ACT
        const articleComment = articlePage.getArticleComment(
          newCommentData.body,
        );
        await expect(articleComment.body).toHaveText(newCommentData.body);
        // await articleComment.lnk.click();
        const commentPage = await articlePage.clickCommentLink(
          articleComment.link,
        );

        // Assert
        await expect(commentPage.commentBody).toHaveText(newCommentData.body);

        return commentPage;
      });

      let editCommentData: AddCommentModel;
      await test.step('Update comment', async () => {
        // Arrange
        const expectedCommentUpdatedPopup = 'Comment was updated';
        editCommentData = prepareRandomComment();

        // ACT
        await commentPage.editButton.click();
        await editCommentView.updateComment(editCommentData);

        // Assert
        await expect
          .soft(commentPage.alertPopup)
          .toHaveText(expectedCommentUpdatedPopup);
        await expect(commentPage.commentBody).toHaveText(editCommentData.body);
      });

      await test.step('Verify updated comment in article page', async () => {
        // ACT
        await commentPage.returnLink.click();
        const updatedArticleComment = articlePage.getArticleComment(
          editCommentData.body,
        );

        // Assert
        await expect(updatedArticleComment.body).toHaveText(
          editCommentData.body,
        );
      });

      await test.step('create and verify second comment', async () => {
        // Arrange
        const secondCommentData = prepareRandomComment();
        // Act
        const addCommentView = await articlePage.clickCommentButton();
        await addCommentView.createComment(secondCommentData);
        // Assert
        const articleComment = articlePage.getArticleComment(
          secondCommentData.body,
        );
        await expect(articleComment.body).toHaveText(secondCommentData.body);
        await articleComment.link.click();
        await expect(commentPage.commentBody).toHaveText(
          secondCommentData.body,
        );
      });
    },
  );
  test(
    'User can create more than one comment',
    { tag: ['@GAD-R05-03', '@logged'] },
    async () => {
      await test.step('Create new comment', async () => {
        // Arrange
        const expectedCommentCreatedPopup = 'Comment was created';
        const newCommentData = prepareRandomComment();

        // ACT
        const addCommentView = await articlePage.clickCommentButton();
        await addCommentView.createComment(newCommentData);

        // Assert
        await expect
          .soft(articlePage.alertPopup)
          .toHaveText(expectedCommentCreatedPopup);
      });

      await test.step('create and verify second comment', async () => {
        const secondCommentBody =
          await test.step('create second comment', async () => {
            const secondCommentData = prepareRandomComment();
            const addCommentView = await articlePage.clickCommentButton();
            await addCommentView.createComment(secondCommentData);
            return secondCommentData.body;
          });
        await test.step('verify second comment', async () => {
          const articleComment =
            articlePage.getArticleComment(secondCommentBody);
          await expect(articleComment.body).toHaveText(secondCommentBody);
          const commentPage = await articlePage.clickCommentLink(
            articleComment.link,
          );
          await expect(commentPage.commentBody).toHaveText(secondCommentBody);
        });
      });
    },
  );
});
