import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { testUser1 } from '@_src/test-data/user-data';
import { APIRequestContext } from '@playwright/test';

export const apiLinks = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
};

interface Headers {
  [key: string]: string;
}
export async function getAuthorizationHeader(
  request: APIRequestContext,
): Promise<Headers> {
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

  return {
    Authorization: `Bearer ${token}`,
  };
}

interface ArticlePayload {
  title: string;
  body: string;
  date: string;
  image: string;
}

export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomArticle();
  const articleData = {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: '2025-05-21T09:34:59.086Z',
    image:
      '.\\data\\images\\256\\team-testers_c4a246ec-8a7f-4f93-8b3a-2bc9ae818bbc.jpg',
  };
  return articleData;
}

interface CommentPayload {
  article_id: number;
  body: string;
  date: string;
}
export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  const commentData = {
    article_id: articleId,
    body: randomCommentData.body,
    date: '2025-05-21T09:34:59.086Z',
  };
  return commentData;
}
