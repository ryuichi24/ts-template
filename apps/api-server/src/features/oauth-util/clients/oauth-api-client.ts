export type UserInfo = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  avatarUrl: string;
};

export interface IOauthApiClient {
  requestToken(dto: {
    tokenUrl: string;
    tokenCode: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    grantType: string;
  }): Promise<{ accessToken: string; refreshToken: string; expiresIn: number; idToken: string }>;
  requestUserInfo(accessToken: string): Promise<UserInfo>;
}
