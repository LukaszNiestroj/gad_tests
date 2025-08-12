import { Headers } from '@_src/api/models/headers.api.model';
import { LoginRequest } from '@_src/api/requests/login.request';
import { LoginData } from '@_src/ui/models/login.model';
import { testUser1 } from '@_src/ui/test-data/user-data';
import { APIRequestContext } from '@playwright/test';

export async function getAuthorizationHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const loginData: LoginData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };

  const loginRequest = new LoginRequest(request);
  const responseLogin = await loginRequest.post(loginData);
  const responseLoginJson = await responseLogin.json();
  const token = responseLoginJson.access_token;

  return {
    Authorization: `Bearer ${token}`,
  };
}
