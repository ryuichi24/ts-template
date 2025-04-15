import { Injectable } from "@nestjs/common";
import { OauthTokenRepository } from "./oauth-token.repository";

@Injectable()
export class OauthTokenInMemoryRepository implements OauthTokenRepository {
  private _oauthToken: OauthTokenRepository.OauthToken[];

  constructor() {
    this._oauthToken = [];
  }

  async create(cmd: OauthTokenRepository.CreateCommand): Promise<OauthTokenRepository.OauthToken> {
    const newOAuthToken = {
      id: crypto.randomUUID(),
      ...cmd,
      expiresAt: new Date(Date.now() + cmd.expiresIn * 1000),
      createdAt: new Date(),
    };

    this._oauthToken.push(newOAuthToken);

    return newOAuthToken as OauthTokenRepository.OauthToken;
  }

  async getByOauthId(query: OauthTokenRepository.GetBuOauthIdQuery): Promise<OauthTokenRepository.OauthToken | null> {
    const foundOAuthToken = this._oauthToken.find((token) => token.oauthId === query.oauthId);
    if (!foundOAuthToken) {
      return null;
    }
    return foundOAuthToken;
  }

  async update(cmd: OauthTokenRepository.UpdateCommand): Promise<OauthTokenRepository.OauthToken | null> {
    const existingOAuthToken = await this.getByOauthId({ oauthId: cmd.oauthId });
    if (!existingOAuthToken) {
      return null;
    }

    existingOAuthToken.accessToken = cmd.accessToken;
    existingOAuthToken.refreshToken = cmd.refreshToken;
    existingOAuthToken.expiresAt = cmd.expiresAt;

    return existingOAuthToken;
  }

  async delete(cmd: OauthTokenRepository.DeleteCommand): Promise<void> {
    this._oauthToken = this._oauthToken.filter((token) => token.oauthId !== cmd.oauthId);
  }
}
