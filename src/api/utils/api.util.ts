import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { testUser1 } from '@_src/ui/test-data/user-data';
import { APIRequestContext } from '@playwright/test';

export interface ArticlePayload {
  title: string;
  body: string;
  date: string;
  image: string;
}

export interface CommentPayload {
  article_id: number;
  body: string;
  date: string;
}
export interface Headers {
  [key: string]: string;
}

export const apiLinks = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
};

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

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  const commentData = {
    article_id: articleId,
    body: randomCommentData.body,
    date: '2025-05-21T09:34:59.086Z',
  };
  return commentData;
}
