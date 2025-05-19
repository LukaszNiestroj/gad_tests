import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify comments API endpoint', () => {
  test(
    'GET comments returns status code 200',
    { tag: ['@GAD-R08-02', '@smoke', '@api'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200;
      const commentsUrl = '/api/comments';

      // Act
      const response = await request.get(commentsUrl);

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    },
  );
  test(
    'GET comments should return at least 1 article',
    { tag: ['@GAD-R08-02', '@predefine_data'] },
    async ({ request }) => {
      // Arrange
      const expectedMinCommentsCount = 1;
      const commentsUrl = '/api/comments';
      // Act
      const response = await request.get(commentsUrl);
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
    async ({ request }) => {
      // Arrange
      const commentsUrl = '/api/comments';
      const expectedRequiredProperties = [
        'id',
        'user_id',
        'article_id',
        'body',
        'date',
      ];
      // Act
      const response = await request.get(commentsUrl);
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
