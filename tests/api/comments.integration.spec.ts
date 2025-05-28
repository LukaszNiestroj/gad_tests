import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user-data';

test.describe('Verify comment CRUD operations', () => {
  let articleId: number;
  let headers: { [key: string]: string };
  test.beforeAll('create an article', async ({ request }) => {
    // Login as a user
    const loginUrl = '/api/login';
    const userData = {
      email: testUser1.userEmail,
      password: testUser1.userPassword,
    };
    const responseLogin = await request.post(loginUrl, {
      data: userData,
    });
    const responseLoginJson = await responseLogin.json();
    const token = responseLoginJson.access_token;

    // Create article
    const articlesUrl = '/api/articles';
    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2025-05-21T09:34:59.086Z',
      image:
        '.\\data\\images\\256\\team-testers_c4a246ec-8a7f-4f93-8b3a-2bc9ae818bbc.jpg',
    };

    headers = {
      Authorization: `Bearer ${token}`,
    };

    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    });

    const article = await responseArticle.json();
    articleId = article.id;
  });
  test(
    'should not create an comment without a logged-in user',
    { tag: ['@GAD-R09-02', '@integration', '@api'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401;
      const commentsUrl = '/api/comments';
      const randomCommentData = prepareRandomComment();
      const commentData = {
        article_id: articleId,
        body: randomCommentData.body,
        date: '2025-05-21T09:34:59.086Z',
      };

      // Act
      const response = await request.post(commentsUrl, {
        data: commentData,
      });

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    },
  );
  test(
    'should create an comment with a logged-in user',
    { tag: ['@GAD-R09-02', '@integration', '@crud'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201;

      // Act
      const commentsUrl = '/api/comments';
      const randomCommentData = prepareRandomComment();
      const commentData = {
        article_id: articleId,
        body: randomCommentData.body,
        date: '2025-05-21T09:34:59.086Z',
      };

      // Act
      const response = await request.post(commentsUrl, {
        headers,
        data: commentData,
      });

      // Assert
      const actualResponseStatus = response.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await response.json();
      expect.soft(comment.body).toEqual(commentData.body);

      await new Promise((resolve) => setTimeout(resolve, 5000));
    },
  );
});
