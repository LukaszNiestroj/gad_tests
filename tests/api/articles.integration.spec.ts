import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  ArticlePayload,
  Headers,
  apiLinks,
  getAuthorizationHeader,
  prepareArticlePayload,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

test.describe('Verify articles CRUD operations', () => {
  test(
    'should not create an article without a logged-in user',
    { tag: ['@GAD-R09-01', '@integration', '@crud'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401;
      const articleData = prepareArticlePayload();
      // Act
      const response = await request.post(apiLinks.articlesUrl, {
        data: articleData,
      });
      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    },
  );
  test.describe('CRUD operataions', { tag: ['@crud'] }, () => {
    let responseArticle: APIResponse;
    let headers: Headers;
    let articleData: ArticlePayload;

    test.beforeAll('should login as a user', async ({ request }) => {
      headers = await getAuthorizationHeader(request);
    });

    test.beforeEach('create an article', async ({ request }) => {
      articleData = prepareArticlePayload();
      responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      });
    });

    test(
      'should create an article with a logged-in user',
      { tag: ['@GAD-R09-01'] },
      async () => {
        // Arrange
        const expectedStatusCode = 201;
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
      'should delete an article with a logged-in user',
      { tag: ['@GAD-R09-03'] },
      async ({ request }) => {
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        // Arrange
        const expectedStatusCode = 200;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;
        // Act
        const responseArticleDelete = await request.delete(
          `${apiLinks.articlesUrl}/${articleId}`,
          {
            headers,
          },
        );
        // Assert
        const actualResponseStatus = responseArticleDelete.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check if the article is deleted
        const responseArticleGet = await request.get(
          `${apiLinks.articlesUrl}/${articleId}`,
        );
        const expectedDeleteArticleStatusCode = 404;
        expect(
          responseArticleGet.status(),
          `expect status code ${expectedDeleteArticleStatusCode}, and received ${responseArticleGet.status()}`,
        ).toBe(expectedDeleteArticleStatusCode);
      },
    );

    test(
      'should not delete an article with non a logged-in user',
      { tag: ['@GAD-R09-03'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;
        // Act
        const responseArticleDelete = await request.delete(
          `${apiLinks.articlesUrl}/${articleId}`,
        );
        // Assert
        const actualResponseStatus = responseArticleDelete.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check if the article is not deleted
        const responseArticleGet = await request.get(
          `${apiLinks.articlesUrl}/${articleId}`,
        );
        const expectedNotDeleteArticleStatusCode = 200;
        expect(
          responseArticleGet.status(),
          `expect status code ${expectedNotDeleteArticleStatusCode}, and received ${responseArticleGet.status()}`,
        ).toBe(expectedNotDeleteArticleStatusCode);
      },
    );
  });
});
