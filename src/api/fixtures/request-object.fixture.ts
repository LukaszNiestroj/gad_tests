import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { CommentsRequest } from '@_src/api/requests/comments.request';
import { test as baseTest } from '@playwright/test';

interface Requests {
  articlesRequest: ArticlesRequest;
  articlesRequestLogged: ArticlesRequest;
  commentsRequest: CommentsRequest;
  commentsRequestLogged: CommentsRequest;
}

export const requestObjectTest = baseTest.extend<Requests>({
  articlesRequest: async ({ request }, use) => {
    const articlesRequest = new ArticlesRequest(request);
    await use(articlesRequest);
  },
  articlesRequestLogged: async ({ request }, use) => {
    const headers = await getAuthorizationHeader(request);
    const articlesRequest = new ArticlesRequest(request, headers);
    await use(articlesRequest);
  },

  commentsRequest: async ({ request }, use) => {
    const commentsRequest = new CommentsRequest(request);
    await use(commentsRequest);
  },

  commentsRequestLogged: async ({ request }, use) => {
    const headers = await getAuthorizationHeader(request);
    const commentsRequest = new CommentsRequest(request, headers);
    await use(commentsRequest);
  },
});
