import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comment modification operations',
  { tag: ['@crud', '@api', '@comment', '@modify'] },
  () => {
    let articleId: number;
    let headers: Headers;
    let responseComment: APIResponse;
    let commentData: CommentPayload;
    test.beforeAll('create an article', async ({ request }) => {
      // Login as a user
      headers = await getAuthorizationHeader(request);
      // Create article
      const responseArticle = await createArticleWithApi(request, headers);

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test.beforeEach('create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId);
      responseComment = await createCommentWithApi(
        request,
        headers,
        articleId,
        commentData,
      );
    });

    test(
      'should modify a comment with a logged-in user',
      { tag: ['@GAD-R10-02'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const comment = await responseComment.json();
        const modifiedCommentData = prepareCommentPayload(articleId);

        // Act
        const responseCommentModified = await request.put(
          `${apiUrls.commentsUrl}/${comment.id}`,
          {
            headers,
            data: modifiedCommentData,
          },
        );

        // Assert
        const actualResponseStatus = responseCommentModified.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);
        // Assert after modification comment
        const modifiedCommentGet = await request.get(
          `${apiUrls.commentsUrl}/${comment.id}`,
        );
        const modifiedCommentGetJson = await modifiedCommentGet.json();
        expect
          .soft(modifiedCommentGetJson.body)
          .toEqual(modifiedCommentData.body);
        expect.soft(modifiedCommentGetJson.body).not.toEqual(commentData.body);
      },
    );

    test(
      'should not modify a comment with a non logged-in user',
      { tag: ['@GAD-R10-02'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const comment = await responseComment.json();
        const modifiedCommentData = prepareCommentPayload(articleId);

        // Act
        const responseCommentNotModified = await request.put(
          `${apiUrls.commentsUrl}/${comment.id}`,
          {
            data: modifiedCommentData,
          },
        );

        // Assert
        const actualResponseStatus = responseCommentNotModified.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert non modified comment
        const modifiedCommentGet = await request.get(
          `${apiUrls.commentsUrl}/${comment.id}`,
        );
        const modifiedCommentGetJson = await modifiedCommentGet.json();
        expect.soft(modifiedCommentGetJson.body).toEqual(commentData.body);
        expect
          .soft(modifiedCommentGetJson.body)
          .not.toEqual(modifiedCommentData.body);
      },
    );
  },
);
