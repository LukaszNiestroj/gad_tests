import { Headers } from '@_src/api/models/headers.api.model';
import { testUser1 } from '@_src/ui/test-data/user-data';
import { APIRequestContext } from '@playwright/test';

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
