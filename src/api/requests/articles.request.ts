import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest {
  url: string;
  constructor(protected request: APIRequestContext) {
    this.url = apiUrls.articlesUrl;
  }

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url);
  }

  async getOne(articleId: string): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${articleId}`);
  }
}
