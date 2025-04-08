export type UserInfo = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  username: string;
  givenName: string;
  familyName: string;
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
