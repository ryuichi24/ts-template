import { ConfigService } from "@nestjs/config";
import { OAuthAgent, OAuthPlatformType, OAuthTokenResponse } from "./oauth-agent";
import { Injectable } from "@nestjs/common";
import { GoogleOauthApiClient } from "../clients/google-oauth-api-client";
import { UserInfo } from "../clients/oauth-api-client";

@Injectable()
export class GoogleOAuthAgent extends OAuthAgent {
  constructor(
    platform: OAuthPlatformType,
    private _configService: ConfigService,
    private _googleApiClient: GoogleOauthApiClient,
  ) {
    super(platform);
  }

  makeLoginUrl(): string {
    const clientId = this._configService.getOrThrow(`auth.oauth.${this.platformName}.provider.google.clientId`, {
      infer: true,
    });
    const authURL = this._configService.getOrThrow(`auth.oauth.${this.platformName}.provider.google.authURL`, {
      infer: true,
    });
    const redirectUri = this._configService.getOrThrow(`auth.oauth.${this.platformName}.provider.google.redirectUri`, {
      infer: true,
    });
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid profile email",
      access_type: "offline",
      prompt: "consent",
    });
    const url = `${authURL}?${params.toString()}`;
    return url;
  }

  async getAuthTokens(code: string): Promise<OAuthTokenResponse> {
    const clientId = this._configService.getOrThrow<string>(
      `auth.oauth.${this.platformName}.provider.google.clientId`,
      {
        infer: true,
      },
    );
    const clientSecret = this._configService.getOrThrow<string>(
      `auth.oauth.${this.platformName}.provider.google.clientSecret`,
      {
        infer: true,
      },
    );
    const redirectUri = this._configService.getOrThrow<string>(
      `auth.oauth.${this.platformName}.provider.google.redirectUri`,
      {
        infer: true,
      },
    );
    const tokenUrl = this._configService.getOrThrow<string>(
      `auth.oauth.${this.platformName}.provider.google.tokenUrl`,
      {
        infer: true,
      },
    );

    const res = await this._googleApiClient.requestToken({
      tokenUrl,
      tokenCode: code,
      clientId,
      clientSecret,
      redirectUri,
      grantType: "authorization_code",
    });

    return res;
  }

  makeLoginSuccessUrl(payload: {
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
  }): string {
    const params = new URLSearchParams({
      access_token: payload.accessToken,
      access_token_expires_at: payload.accessTokenExpiresAt.toISOString(),
      refresh_token: payload.refreshToken,
      refresh_token_expires_at: payload.refreshTokenExpiresAt.toISOString(),
    });

    let protocol = "https";

    if (this.platform === "desktop") {
      const desktopProtocol = this._configService.getOrThrow<string>(`auth.oauth.${this.platformName}.protocol`, {
        infer: true,
      });
      protocol = desktopProtocol;
    }

    return `${protocol}://success?${params.toString()}`;
  }

  async fetchUserInfo(accessToken: string): Promise<UserInfo> {
    const userInfo = await this._googleApiClient.requestUserInfo(accessToken);
    return userInfo;
  }
}
