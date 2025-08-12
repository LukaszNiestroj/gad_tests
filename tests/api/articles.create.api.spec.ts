import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { timestamp } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';

test.describe(
  'Verify articles create operations',
  { tag: ['@api', '@article', '@crud', '@create'] },
  () => {
    test(
      'should not create an article without a logged-in user',
      { tag: ['@GAD-R09-01', '@integration', '@crud'] },
      async ({ articlesRequest }) => {
        // Arrange
        const expectedStatusCode = 401;
        const articleData = prepareArticlePayload();
        // Act
        const response = await articlesRequest.post(articleData);
        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      },
    );
    test.describe('Create operations', { tag: ['@crud'] }, () => {
      test(
        'should create an article with a logged-in user',
        { tag: ['@GAD-R09-01'] },
        async ({ articlesRequestLogged }) => {
          // Arrange
          const expectedStatusCode = 201;

          // Act
          const articleData = prepareArticlePayload();
          const responseArticle = await createArticleWithApi(
            articlesRequestLogged,
            articleData,
          );
          // Assert
          const actualResponseStatus = responseArticle.status();
          expect(
            actualResponseStatus,
            `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const articleJson = await responseArticle.json();
          expect.soft(articleJson.title).toEqual(articleData.title);
          expect.soft(articleJson.body).toEqual(articleData.body);
        },
      );
      test(
        'should create new article when modified article id not exist with a logged-in user',
        { tag: ['@GAD-R10-01'] },
        async ({ articlesRequestLogged }) => {
          // Arrange
          const expectedStatusCode = 201;
          const articleData = prepareArticlePayload();
          // Act
          const responseArticlePut = await articlesRequestLogged.put(
            articleData,
            timestamp(),
          );
          // Assert
          const actualResponseStatus = responseArticlePut.status();
          expect(
            actualResponseStatus,
            `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const articleJson = await responseArticlePut.json();

          expect.soft(articleJson.title).toEqual(articleData.title);
          expect.soft(articleJson.body).toEqual(articleData.body);
        },
      );
    });
  },
);
