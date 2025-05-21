import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user-data';

test.describe('Verify comment CRUD operations', () => {
  test(
    'should not create an comment without a logged-in user',
    { tag: ['@GAD-R09-02', '@integration', '@api'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401;
      const commentsUrl = '/api/comments';
      const randomCommentData = prepareRandomComment();
      const commentData = {
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
    { tag: ['@GAD-R09-02', '@integration', '@api'] },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201;

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

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const responseArticle = await request.post(articlesUrl, {
        headers,
        data: articleData,
      });

      // Assert
      const actualResponseStatus = responseArticle.status();
      expect(
        actualResponseStatus,
        `Status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const article = await responseArticle.json();
      expect.soft(article.title).toEqual(articleData.title);
      expect.soft(article.body).toEqual(articleData.body);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Create a comment
      // Arrange
      const commentsUrl = '/api/comments';
      const randomCommentData = prepareRandomComment();

      // Act
      const commentData = {
        article_id: article.id,
        body: randomCommentData.body,
        date: '2025-05-21T09:34:59.086Z',
      };
      const responseComment = await request.post(commentsUrl, {
        headers,
        data: commentData,
      });

      // Assert
      const actualResponseCommentStatus = responseComment.status();
      expect(
        actualResponseStatus,
        `Status code expected ${expectedStatusCode}, but received ${actualResponseCommentStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await responseComment.json();
      expect.soft(comment.article_id).toEqual(commentData.article_id);
      expect.soft(comment.body).toEqual(commentData.body);
    },
  );
});
