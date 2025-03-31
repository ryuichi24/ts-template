import { IOauthApiClient } from "./oauth-api-client";

export class GithubOauthApiClient implements IOauthApiClient {
  requestToken(dto: {
    tokenUrl: string;
    tokenCode: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    grantType: string;
  }): Promise<{ accessToken: string; refreshToken: string; expiresIn: number; idToken: string }> {
    throw new Error("Method not implemented.");
  }

  requestUserInfo(accessToken: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
