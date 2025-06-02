import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  CommentPayload,
  Headers,
  apiLinks,
  getAuthorizationHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

test.describe('Verify comment CRUD operations', () => {
  let articleId: number;
  let headers: Headers;
  test.beforeAll('create an article', async ({ request }) => {
    // Login as a user
    headers = await getAuthorizationHeader(request);
    // Create article

    const articleData = prepareArticlePayload();
    const responseArticle = await request.post(apiLinks.articlesUrl, {
      headers,
      data: articleData,
    });

    const article = await responseArticle.json();
    articleId = article.id;
  });
  test(
    'should not create an comment without a logged-in user',
    { tag: ['@GAD-R09-02', '@integration', '@api'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401;
      const commentData = prepareCommentPayload(articleId);

      // Act
      const response = await request.post(apiLinks.commentsUrl, {
        data: commentData,
      });

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    },
  );

  test.describe('CRUD operations', { tag: ['@crud'] }, () => {
    let responseComment: APIResponse;
    let commentData: CommentPayload;

    test.beforeEach('create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId);
      responseComment = await request.post(apiLinks.commentsUrl, {
        headers,
        data: commentData,
      });

      await new Promise((resolve) => setTimeout(resolve, 5000));
    });

    test(
      'should create a comment with a logged-in user',
      { tag: ['@GAD-R09-02'] },
      async () => {
        // Arrange
        const expectedStatusCode = 201;
        // Assert
        const actualResponseStatus = responseComment.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        const comment = await responseComment.json();
        expect.soft(comment.body).toEqual(commentData.body);
      },
    );

    test(
      'should delete a comment with a logged-in user',
      { tag: ['@GAD-R09-04'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const comment = await responseComment.json();

        // Act
        const responseCommentDeleted = await request.delete(
          `${apiLinks.commentsUrl}/${comment.id}`,
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
        const responseCommentDeletedGet = await request.get(
          `${apiLinks.commentsUrl}/${comment.id}`,
          {
            headers,
          },
        );
        expect(
          responseCommentDeletedGet.status(),
          `expect status code ${expectedStatusDeletedComment}, and received ${responseCommentDeletedGet.status()}`,
        ).toBe(expectedStatusDeletedComment);
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
          `${apiLinks.commentsUrl}/${comment.id}`,
        );

        // Assert
        const actualResponseStatus = responseCommentNotDeleted.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert non deleted comment
        const expectedStatusNotDeletedComment = 200;
        const responseCommentNotDeletedGet = await request.get(
          `${apiLinks.commentsUrl}/${comment.id}`,
        );

        expect(
          responseCommentNotDeletedGet.status(),
          `expect status code ${expectedStatusNotDeletedComment}, and received ${responseCommentNotDeletedGet.status()}`,
        ).toBe(expectedStatusNotDeletedComment);
      },
    );
  });
});
