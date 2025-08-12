import { expectGetResponseStatus } from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { prepareAndCreateCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comment DELETE operations',
  { tag: ['@crud', '@api', '@comment', '@delete'] },
  () => {
    let articleId: number;
    let headers: Headers;
    let responseComment: APIResponse;
    test.beforeAll(
      'create an article',
      async ({ request, articlesRequestLogged }) => {
        // Login as a user
        headers = await getAuthorizationHeader(request);
        // Create article
        const responseArticle = await createArticleWithApi(
          articlesRequestLogged,
        );

        const article = await responseArticle.json();
        articleId = article.id;
      },
    );

    test.beforeEach('create a comment', async ({ request }) => {
      responseComment = await prepareAndCreateCommentWithApi(
        request,
        headers,
        articleId,
      );
    });

    test(
      'should delete a comment with a logged-in user',
      { tag: ['@GAD-R09-04'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const comment = await responseComment.json();

        // Act
        const responseCommentDeleted = await request.delete(
          `${apiUrls.commentsUrl}/${comment.id}`,
          {
            headers,
          },
        );

        // Assert
        const actualResponseStatus = responseCommentDeleted.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);
        // Assert after deletion comment
        const expectedStatusDeletedComment = 404;
        await expectGetResponseStatus(
          request,
          `${apiUrls.commentsUrl}/${comment.id}`,
          expectedStatusDeletedComment,
          headers,
        );
      },
    );

    test(
      'should not delete a comment with a non logged-in user',
      { tag: ['@GAD-R09-04'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const comment = await responseComment.json();

        // Act
        const responseCommentNotDeleted = await request.delete(
          `${apiUrls.commentsUrl}/${comment.id}`,
        );

        // Assert
        const actualResponseStatus = responseCommentNotDeleted.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert non deleted comment
        const expectedStatusNotDeletedComment = 200;
        await expectGetResponseStatus(
          request,
          `${apiUrls.commentsUrl}/${comment.id}`,
          expectedStatusNotDeletedComment,
          headers,
        );
      },
    );
  },
);
