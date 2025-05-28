import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  apiLinks,
  getAuthorizationHeader,
  prepareArticlePayload,
} from '@_src/utils/api.util';

test.describe('Verify articles CRUD operations', () => {
  test(
    'should not create an article without a logged-in user',
    { tag: ['@GAD-R09-01', '@integration', '@api'] },
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
  test(
    'should create an article with a logged-in user',
    { tag: ['@GAD-R09-01', '@integration', '@crud'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201;
      // Login as a user
      const headers = await getAuthorizationHeader(request);
      // Act
      const articleData = prepareArticlePayload();
      const responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      });
      // Assert
      const actualResponseStatus = responseArticle.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const article = await responseArticle.json();
      expect.soft(article.title).toEqual(articleData.title);
      expect.soft(article.body).toEqual(articleData.body);
    },
  );
});
