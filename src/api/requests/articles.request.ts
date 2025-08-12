import { ArticlePayload } from '@_src/api/models/article.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest {
  url: string;
  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {
    this.url = apiUrls.articlesUrl;
  }

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url);
  }

  async getOne(articleId: string): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${articleId}`);
  }

  async post(data: ArticlePayload): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers: this.headers,
      data,
    });
  }

  async put(data: ArticlePayload, articleId?: string): Promise<APIResponse> {
    return await this.request.put(`${this.url}/${articleId}`, {
      headers: this.headers,
      data,
    });
  }

  async patch(
    data: Partial<ArticlePayload>,
    articleId?: string,
  ): Promise<APIResponse> {
    return await this.request.patch(`${this.url}/${articleId}`, {
      headers: this.headers,
      data,
    });
  }
}
