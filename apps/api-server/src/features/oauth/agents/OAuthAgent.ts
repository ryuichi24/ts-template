export type OAuthPlatformType = "web" | "desktop" | "mobile";
export type OAuthProviderType = "google" | "github" | "discord";

export type OAuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
};

export interface IOAuthAgent {
  makeLoginUrl(): string;
  makeLoginSuccessUrl(payload: {
    accessToken: string;
    accessTokenExpiresIn: string;
    refreshToken: string;
    refreshTokenExpiresIn: string;
  }): string;
  getAuthTokens(code: string): Promise<OAuthTokenResponse>;
  fetchUserInfo(accessToken: string): Promise<any>;
}

export abstract class OAuthAgent implements IOAuthAgent {
  constructor(protected platform: OAuthPlatformType) {}
  abstract makeLoginUrl(): string;
  abstract makeLoginSuccessUrl(payload: {
    accessToken: string;
    accessTokenExpiresIn: string;
    refreshToken: string;
    refreshTokenExpiresIn: string;
  }): string;
  abstract getAuthTokens(code: string): Promise<OAuthTokenResponse>;
  abstract fetchUserInfo(accessToken: string): Promise<any>;

  protected get platformName(): string {
    return this.platform.toLocaleLowerCase();
  }
}
