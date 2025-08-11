import { expectGetResponseStatus } from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles DELETE operations',
  { tag: ['@api', '@article', '@crud', '@delete'] },
  () => {
    let responseArticle: APIResponse;
    let headers: Headers;
    let articleData: ArticlePayload;

    test.beforeAll('should login as a user', async ({ request }) => {
      headers = await getAuthorizationHeader(request);
    });

    test.beforeEach('create an article', async ({ request }) => {
      articleData = prepareArticlePayload();
      responseArticle = await createArticleWithApi(
        request,
        headers,
        articleData,
      );
    });

    test(
      'should delete an article with a logged-in user',
      { tag: ['@GAD-R09-03'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;
        // Act
        const responseArticleDelete = await request.delete(
          `${apiUrls.articlesUrl}/${articleId}`,
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
        const expectedDeleteArticleStatusCode = 404;
        await expectGetResponseStatus(
          request,
          `${apiUrls.articlesUrl}/${articleId}`,
          expectedDeleteArticleStatusCode,
        );
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
          `${apiUrls.articlesUrl}/${articleId}`,
        );
        // Assert
        const actualResponseStatus = responseArticleDelete.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check if the article is not deleted
        const expectedNotDeleteArticleStatusCode = 200;
        await expectGetResponseStatus(
          request,
          `${apiUrls.articlesUrl}/${articleId}`,
          expectedNotDeleteArticleStatusCode,
        );
      },
    );
  },
);
