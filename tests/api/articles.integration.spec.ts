import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { getAuthorizationHeader } from '@_src/utils/api.util';

test.describe('Verify articles CRUD operations', () => {
  test(
    'should not create an article without a logged-in user',
    { tag: ['@GAD-R09-01', '@integration', '@api'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401;
      const articlesUrl = '/api/articles';
      const randomArticleData = prepareRandomArticle();
      const articleData = {
        title: randomArticleData.title,
        body: randomArticleData.body,
        date: '2025-05-21T09:34:59.086Z',
        image: '',
      };

      // Act
      const response = await request.post(articlesUrl, {
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
      const articlesUrl = '/api/articles';
      const randomArticleData = prepareRandomArticle();
      const articleData = {
        title: randomArticleData.title,
        body: randomArticleData.body,
        date: '2025-05-21T09:34:59.086Z',
        image:
          '.\\data\\images\\256\\team-testers_c4a246ec-8a7f-4f93-8b3a-2bc9ae818bbc.jpg',
      };

      const responseArticle = await request.post(articlesUrl, {
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
