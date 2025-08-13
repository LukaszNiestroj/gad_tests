import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comment modification operations',
  { tag: ['@crud', '@api', '@comment', '@modify'] },
  () => {
    let articleId: number;
    let headers: Headers;
    let responseComment: APIResponse;
    let commentData: CommentPayload;
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

    test.beforeEach('create a comment', async ({ commentsRequestLogged }) => {
      commentData = prepareCommentPayload(articleId);
      responseComment = await createCommentWithApi(
        commentsRequestLogged,
        commentData,
      );
    });

    test.describe('fully modify comment', () => {
      test(
        'should modify a comment with a logged-in user',
        { tag: ['@GAD-R10-02'] },
        async ({ request, commentsRequest }) => {
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
          const modifiedCommentGet = await commentsRequest.getOne(comment.id);
          const modifiedCommentGetJson = await modifiedCommentGet.json();
          expect
            .soft(modifiedCommentGetJson.body)
            .toEqual(modifiedCommentData.body);
          expect
            .soft(modifiedCommentGetJson.body)
            .not.toEqual(commentData.body);
        },
      );

      test(
        'should not modify a comment with a non logged-in user',
        { tag: ['@GAD-R10-02'] },
        async ({ request, commentsRequest }) => {
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
          const modifiedCommentGet = await await commentsRequest.getOne(
            comment.id,
          );
          const nonModifiedCommentGetJson = await modifiedCommentGet.json();
          expect.soft(nonModifiedCommentGetJson.body).toEqual(commentData.body);
          expect
            .soft(nonModifiedCommentGetJson.body)
            .not.toEqual(modifiedCommentData.body);
        },
      );
    });

    test.describe('partially modify comment', () => {
      test(
        'should partially modify a comment with a logged-in user',
        { tag: ['@GAD-R10-04'] },
        async ({ commentsRequest, commentsRequestLogged }) => {
          // Arrange
          const expectedStatusCode = 200;
          const comment = await responseComment.json();
          const modifiedCommentData = {
            body: `Patched body ${new Date().toISOString()}`,
          };
          // Act
          const responseCommentModifiedPatched =
            await commentsRequestLogged.patch(modifiedCommentData, comment.id);
          // Assert
          const actualResponseStatus = responseCommentModifiedPatched.status();
          expect(
            actualResponseStatus,
            `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);
          // Assert after modification comment
          const modifiedCommentGet = await commentsRequest.getOne(comment.id);
          const modifiedCommentGetJson = await modifiedCommentGet.json();
          expect
            .soft(modifiedCommentGetJson.body)
            .toEqual(modifiedCommentData.body);
          expect
            .soft(modifiedCommentGetJson.body)
            .not.toEqual(commentData.body);
        },
      );

      test(
        'should not partially modify a comment with a non logged-in user',
        { tag: ['@GAD-R10-04'] },
        async ({ commentsRequest }) => {
          // Arrange
          const expectedStatusCode = 401;
          const comment = await responseComment.json();
          const modifiedCommentData = {
            body: `Patched body ${new Date().toISOString()}`,
          };

          // Act
          const responseCommentNotModified = await commentsRequest.patch(
            modifiedCommentData,
            comment.id,
          );

          // Assert
          const actualResponseStatus = responseCommentNotModified.status();
          expect(
            actualResponseStatus,
            `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          // Assert non modified comment
          const modifiedCommentGet = await commentsRequest.getOne(comment.id);
          const nonModifiedCommentGetJson = await modifiedCommentGet.json();
          expect.soft(nonModifiedCommentGetJson.body).toEqual(commentData.body);
          expect
            .soft(nonModifiedCommentGetJson.body)
            .not.toEqual(modifiedCommentData.body);
        },
      );

      test(
        'should not partially modify a comment with a non existing field for logged-in user',
        { tag: ['@GAD-R10-04'] },
        async ({ commentsRequest, commentsRequestLogged }) => {
          // Arrange
          const expectedStatusCode = 422;
          const nonExistingField = 'nonExistingField';
          const expectedErrorMessage = `One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "${nonExistingField}" not in [id,user_id,article_id,body,date]`;

          const comment = await responseComment.json();
          const modifiedCommentData: { [key: string]: string } = {};
          modifiedCommentData[nonExistingField] = `${new Date().toISOString()}`;

          // Act
          const responseCommentNotModified = await commentsRequestLogged.patch(
            modifiedCommentData,
            comment.id,
          );

          // Assert
          const actualResponseStatus = responseCommentNotModified.status();
          expect(
            actualResponseStatus,
            `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          // Assert non modified comment
          const responseCommentNotModifiedJson =
            await responseCommentNotModified.json();
          expect
            .soft(responseCommentNotModifiedJson.error.message)
            .toEqual(expectedErrorMessage);

          const nonModifiedCommentGet = await commentsRequest.getOne(
            comment.id,
          );
          const nonModifiedCommentGetJson = await nonModifiedCommentGet.json();
          expect.soft(nonModifiedCommentGetJson.body).toEqual(commentData.body);
        },
      );
    });
  },
);
