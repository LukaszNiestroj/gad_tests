import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { timestamp } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';

test.describe(
  'Verify comment create operations',
  { tag: ['@crud', '@comment', '@api', '@create'] },
  () => {
    let articleId: number;

    test.beforeAll('create an article', async ({ articlesRequestLogged }) => {
      // Create article
      const responseArticle = await createArticleWithApi(articlesRequestLogged);

      const article = await responseArticle.json();
      articleId = article.id;
    });
    test(
      'should not create an comment without a logged-in user',
      { tag: ['@GAD-R09-02', '@integration', '@api'] },
      async ({ commentsRequest }) => {
        // Arrange
        const expectedStatusCode = 401;
        const commentData = prepareCommentPayload(articleId);

        // Act
        const response = await commentsRequest.post(commentData);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      },
    );

    test(
      'should create a comment with a logged-in user',
      { tag: ['@GAD-R09-02'] },
      async ({ commentsRequestLogged }) => {
        // Arrange
        const expectedStatusCode = 201;

        // Act
        const commentData = prepareCommentPayload(articleId);
        const responseComment = await createCommentWithApi(
          commentsRequestLogged,
          commentData,
        );
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

    test('should create a comment when modification on nonexisting id requested with logged-in user @GAD-R10-02', async ({
      commentsRequestLogged,
      commentsRequest,
    }) => {
      // Arrange
      const expectedStatusCode = 201;
      const commentData = prepareCommentPayload(articleId);

      // Act
      const responseCommentPut = await commentsRequestLogged.put(
        commentData,
        timestamp(),
      );
      // Assert
      const actualResponseStatus = responseCommentPut.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert modified comment
      const responseCommentPutJson = await responseCommentPut.json();
      const commentGet = await commentsRequest.getOne(
        responseCommentPutJson.id,
      );

      const commentGetJson = await commentGet.json();

      expect.soft(commentGetJson.body).toEqual(commentData.body);
    });
  },
);
