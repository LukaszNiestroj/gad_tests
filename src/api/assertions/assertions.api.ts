import { Headers } from '@_src/api/models/headers.api.model';
import { expect } from '@_src/merge.fixture';
import { APIRequestContext } from '@playwright/test';

export async function expectGetResponseStatus(
  request: APIRequestContext,
  url: string,
  expectedStatusCode: number,
  headers?: Headers,
): Promise<void> {
  const responseGet = await request.get(url, { headers });
  expect(
    responseGet.status(),
    `expect status code ${expectedStatusCode}, and received ${responseGet.status()}`,
  ).toBe(expectedStatusCode);
}
