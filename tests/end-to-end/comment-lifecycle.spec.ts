import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { AddCommentModel } from '@_src/models/comment.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    const articlesPage = new ArticlesPage(page);
    articleData = prepareRandomArticle();

    await articlesPage.goto();
    const addArticlesView =
      await articlesPage.mainMenu.clickAddArticleButtonLogged();
    articlePage = await addArticlesView.createArticle(articleData);
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
        const addCommentView = await articlePage.clickAddCommentButton();
        await expect
          .soft(addCommentView.addNewHeader)
          .toHaveText(expectedAddCommentHeader);
        articlePage = await addCommentView.createComment(newCommentData);

        // Assert
        await expect
          .soft(articlePage.alertPopup)
          .toHaveText(expectedCommentCreatedPopup);
      });

      let commentPage = await test.step('Verify comment', async () => {
        // ACT
        const articleComment = articlePage.getArticleComment(
          newCommentData.body,
        );
        await expect(articleComment.body).toHaveText(newCommentData.body);
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
        const editCommentView = await commentPage.clickEditButton();
        commentPage = await editCommentView.updateComment(editCommentData);

        // Assert
        await expect
          .soft(commentPage.alertPopup)
          .toHaveText(expectedCommentUpdatedPopup);
        await expect(commentPage.commentBody).toHaveText(editCommentData.body);
      });

      await test.step('Verify updated comment in article page', async () => {
        // ACT
        const articlePage = await commentPage.clickReturnLink();
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
        const addCommentView = await articlePage.clickAddCommentButton();
        articlePage = await addCommentView.createComment(secondCommentData);
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
        const addCommentView = await articlePage.clickAddCommentButton();
        articlePage = await addCommentView.createComment(newCommentData);

        // Assert
        await expect
          .soft(articlePage.alertPopup)
          .toHaveText(expectedCommentCreatedPopup);
      });

      await test.step('create and verify second comment', async () => {
        const secondCommentBody =
          await test.step('create second comment', async () => {
            const secondCommentData = prepareRandomComment();
            const addCommentView = await articlePage.clickAddCommentButton();
            articlePage = await addCommentView.createComment(secondCommentData);
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
