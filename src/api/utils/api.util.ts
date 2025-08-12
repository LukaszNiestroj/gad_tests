export const apiUrls = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
};

export function timestamp(): string {
  return `${new Date().valueOf()}`;
}
