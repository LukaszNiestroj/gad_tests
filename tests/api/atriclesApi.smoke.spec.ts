import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles API endpoint', () => {
  test.describe('Verify each condition in separate test', () => {
    test(
      'GET articles returns status code 200',
      { tag: ['@GAD-R08-01', '@smoke', '@api'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const articlesUrl = '/api/articles';

        // Act
        const response = await request.get(articlesUrl);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      },
    );
    test(
      'GET articles should return at least 1 article',
      { tag: ['@GAD-R08-01', '@predefine_data'] },
      async ({ request }) => {
        // Arrange
        const expectedMinArticleCount = 1;
        const articlesUrl = '/api/articles';
        // Act
        const response = await request.get(articlesUrl);
        const responseJson = await response.json();

        // Assert
        expect([responseJson].length).toBeGreaterThanOrEqual(
          expectedMinArticleCount,
        );
      },
    );

    test(
      'GET articles return article objects',
      { tag: ['@GAD-R08-01', '@predefine_data'] },
      async ({ request }) => {
        // Arrange
        const articlesUrl = '/api/articles';
        const expectedRequiredProperties = [
          'id',
          'user_id',
          'title',
          'body',
          'date',
          'image',
        ];
        // Act
        const response = await request.get(articlesUrl);
        const responseJson = await response.json();
        const article = responseJson[0];

        // Assert
        expectedRequiredProperties.forEach((property) => {
          expect.soft(article).toHaveProperty(property);
        });
      },
    );
  });

  test(
    'GET articles should return an object with required properties',
    { tag: ['@predefine_data'] },
    async ({ request }) => {
      const articlesUrl = '/api/articles';
      const response = await request.get(articlesUrl);

      await test.step('GET articles returns status code 200', async () => {
        const expectedStatusCode = 200;

        expect(response.status()).toBe(expectedStatusCode);
      });

      const responseJson = await response.json();
      await test.step('GET articles should return at least 1 article', async () => {
        const expectedMinArticleCount = 1;

        expect([responseJson].length).toBeGreaterThanOrEqual(
          expectedMinArticleCount,
        );
      });

      const expectedRequiredProperties = [
        'id',
        'user_id',
        'title',
        'body',
        'date',
        'image',
      ];
      const article = responseJson[0];

      expectedRequiredProperties.forEach(async (property) => {
        await test.step(`response article object contains required field: ${property}`, async () => {
          expect.soft(article).toHaveProperty(property);
        });
      });
    },
  );
});
