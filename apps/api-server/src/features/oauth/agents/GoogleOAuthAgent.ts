import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { OAuthAgent, OAuthPlatformType, OAuthTokenResponse } from "./OAuthAgent";

export class GoogleOAuthAgent extends OAuthAgent {
  constructor(
    platform: OAuthPlatformType,
    private _configService: ConfigService,
  ) {
    super(platform);
  }

  makeLoginUrl(): string {
    const clientId = this._configService.getOrThrow(`auth.oauth.${this.platformName}.google.clientId`, {
      infer: true,
    });
    const authURL = this._configService.getOrThrow(`auth.oauth.${this.platformName}.google.authURL`, {
      infer: true,
    });
    const redirectUri = this._configService.getOrThrow(`auth.oauth.${this.platformName}.google.redirectUri`, {
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
    const clientId = this._configService.getOrThrow<string>(`auth.oauth.${this.platformName}.google.clientId`, {
      infer: true,
    });
    const clientSecret = this._configService.getOrThrow<string>(`auth.oauth.${this.platformName}.google.clientSecret`, {
      infer: true,
    });
    const redirectUri = this._configService.getOrThrow<string>(`auth.oauth.${this.platformName}.google.redirectUri`, {
      infer: true,
    });

    const params = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const url = `${this._configService.getOrThrow(`auth.oauth.${this.platformName}.google.tokenUrl`, { infer: true })}?${params.toString()}`;
    const response = await axios.post(url);

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    const idToken = response.data.id_token;
    const expiresIn = response.data.expires_in;

    return {
      accessToken,
      refreshToken,
      idToken,
      expiresIn,
    };
  }

  makeLoginSuccessUrl(payload: {
    accessToken: string;
    accessTokenExpiresIn: string;
    refreshToken: string;
    refreshTokenExpiresIn: string;
  }): string {
    const params = new URLSearchParams({
      access_token: payload.accessToken,
      access_token_expires_in: payload.accessTokenExpiresIn,
      refresh_token: payload.refreshToken,
      refresh_token_expires_in: payload.refreshTokenExpiresIn,
    });

    return `tstemplate://success?${params.toString()}`;
  }

  async fetchUserInfo(accessToken: string) {
    const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response.data;

    return data;
  }
}
