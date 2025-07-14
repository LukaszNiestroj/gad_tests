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
