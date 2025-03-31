import { Injectable } from "@nestjs/common";

export namespace OAuthTokenManager {
  export type OAuthToken = {
    id: string;
    oauthId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
  };
}

@Injectable()
export class OAuthTokenManager {
  private _oauthToken: OAuthTokenManager.OAuthToken[];

  constructor() {
    this._oauthToken = [];
  }

  public async createOAuthToken(dto: {
    oauthId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }): Promise<OAuthTokenManager.OAuthToken> {
    const newOAuthToken = {
      id: crypto.randomUUID(),
      oauthId: dto.oauthId,
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken,
      expiresAt: dto.expiresAt,
      createdAt: new Date(),
    };

    this._oauthToken.push(newOAuthToken);

    return newOAuthToken;
  }

  public async getOAuthTokenByOauthId(oauthId: string): Promise<OAuthTokenManager.OAuthToken | null> {
    const foundOAuthToken = this._oauthToken.find((token) => token.oauthId === oauthId);
    if (!foundOAuthToken) {
      return null;
    }
    return foundOAuthToken;
  }

  public async updateOAuthToken(dto: {
    oauthId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }): Promise<OAuthTokenManager.OAuthToken | null> {
    const existingOAuthToken = await this.getOAuthTokenByOauthId(dto.oauthId);
    if (!existingOAuthToken) {
      return null;
    }

    existingOAuthToken.accessToken = dto.accessToken;
    existingOAuthToken.refreshToken = dto.refreshToken;
    existingOAuthToken.expiresAt = dto.expiresAt;

    return existingOAuthToken;
  }

  public async deleteOAuthToken(oauthId: string): Promise<void> {
    this._oauthToken = this._oauthToken.filter((token) => token.oauthId !== oauthId);
  }
}
