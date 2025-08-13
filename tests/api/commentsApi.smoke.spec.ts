import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify comments API endpoint', () => {
  test(
    'GET comments returns status code 200',
    { tag: ['@GAD-R08-02', '@smoke', '@smoke'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200;
      // Act
      const response = await request.get(apiUrls.commentsUrl);
      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    },
  );
  test(
    'GET comments should return at least 1 article',
    { tag: ['@GAD-R08-02', '@predefine_data'] },
    async ({ commentsRequest }) => {
      // Arrange
      const expectedMinCommentsCount = 1;
      // Act
      const response = await commentsRequest.get();
      const responseJson = await response.json();
      // Assert
      expect([responseJson].length).toBeGreaterThanOrEqual(
        expectedMinCommentsCount,
      );
    },
  );

  test(
    'GET comments return comment objects',
    { tag: ['@GAD-R08-02', '@predefine_data'] },
    async ({ commentsRequest }) => {
      // Arrange
      const expectedRequiredProperties = [
        'id',
        'user_id',
        'article_id',
        'body',
        'date',
      ];
      // Act
      const response = await commentsRequest.get();
      const responseJson = await response.json();
      const comment = responseJson[0];
      // Assert
      expectedRequiredProperties.forEach((key) => {
        expect
          .soft(
            comment,
            `response comment object contains required field: ${key}`,
          )
          .toHaveProperty(key);
      });
    },
  );
});
