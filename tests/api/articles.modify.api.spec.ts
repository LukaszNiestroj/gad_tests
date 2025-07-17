import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles modification operations',
  { tag: ['@api', '@article', '@crud', '@modify'] },
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
      'should modify and content for an article with a logged-in user',
      { tag: ['@GAD-R10-01'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;
        const modifiedArticleData = prepareArticlePayload();
        // Act
        const responseArticlePut = await request.put(
          `${apiUrls.articlesUrl}/${articleId}`,
          {
            headers,
            data: modifiedArticleData,
          },
        );
        // Assert
        const actualResponseStatus = responseArticlePut.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        const modifyArticleJson = await responseArticlePut.json();

        expect.soft(modifyArticleJson.title).toEqual(modifiedArticleData.title);
        expect.soft(modifyArticleJson.body).toEqual(modifiedArticleData.body);
        expect.soft(modifyArticleJson.title).not.toEqual(articleData.title);
        expect.soft(modifyArticleJson.body).not.toEqual(articleData.body);
      },
    );

    test(
      'should not modify an article with non a logged-in user',
      { tag: ['@GAD-R10-01'] },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;
        const modifiedArticleData = prepareArticlePayload();
        // Act
        const responseArticlePut = await request.put(
          `${apiUrls.articlesUrl}/${articleId}`,
          {
            data: modifiedArticleData,
          },
        );
        // Assert
        const actualResponseStatus = responseArticlePut.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        const notModifyArticle = await request.get(
          `${apiUrls.articlesUrl}/${articleId}`,
        );

        const notModifyArticleJson = await notModifyArticle.json();

        expect
          .soft(notModifyArticleJson.title)
          .not.toEqual(modifiedArticleData.title);
        expect
          .soft(notModifyArticleJson.body)
          .not.toEqual(modifiedArticleData.body);
        expect.soft(notModifyArticleJson.title).toEqual(articleData.title);
        expect.soft(notModifyArticleJson.body).toEqual(articleData.body);
      },
    );
  },
);
