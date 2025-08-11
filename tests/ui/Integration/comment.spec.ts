import { expect, test } from '@_src/merge.fixture';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { waitForResponse } from '@_src/ui/utils/wait.util';

test(
  'Operate on comment and api verification',
  { tag: ['@GAD-R05-01', '@GAD-R05-02', '@GAD-R07-04', '@logged'] },
  async ({ createRandomArticle, page }) => {
    // Arrange
    const newCommentData = prepareRandomComment();
    let articlePage = createRandomArticle.articlePage;

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

      const waitParams = {
        page,
        url: '/api/comments',
        method: 'GET',
        text: newCommentData.body,
      };
      const responsePromise = waitForResponse(waitParams);

      articlePage = await addCommentView.createComment(newCommentData);
      const response = await responsePromise;

      // Assert
      await expect
        .soft(articlePage.alertPopup)
        .toHaveText(expectedCommentCreatedPopup);
      expect(response.ok()).toBeTruthy();
    });
  },
);
