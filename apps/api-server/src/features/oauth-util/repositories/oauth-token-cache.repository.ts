import { OauthTokenRepository } from "./oauth-token.repository";
import { Inject } from "@nestjs/common";
import { CacheService } from "src/features/util/cache/cache.service";
import { OauthTokenCache } from "../cache/oauth-token-cache";

export class OauthTokenStrapiRepository implements OauthTokenRepository {
  constructor(@Inject(OauthTokenCache) private _cacheService: CacheService) {}

  async create(cmd: OauthTokenRepository.CreateCommand): Promise<OauthTokenRepository.OauthToken> {
    const newOAuthToken = {
      id: crypto.randomUUID(),
      oauthId: cmd.oauthId,
      accessToken: cmd.accessToken,
      refreshToken: cmd.refreshToken,
      expiresAt: new Date(Date.now() + cmd.expiresIn * 1000),
      createdAt: new Date(),
    };

    // new Date(Date.now() + authTokenResponse.expiresIn * 1000)
    this._cacheService.set(
      `oauthToken:${newOAuthToken.oauthId}`,
      {
        id: newOAuthToken.id,
        oauthId: newOAuthToken.oauthId,
        accessToken: newOAuthToken.accessToken,
        refreshToken: newOAuthToken.refreshToken,
        expiresAt: newOAuthToken.expiresAt,
        createdAt: newOAuthToken.createdAt,
      },
      { expiresIn: cmd.expiresIn },
    );

    return newOAuthToken;
  }

  async getByOauthId(query: OauthTokenRepository.GetBuOauthIdQuery): Promise<OauthTokenRepository.OauthToken | null> {
    const foundOAuthToken = this._cacheService.get(`oauthToken:${query.oauthId}`);
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
    await this._cacheService.delete(`oauthToken:${cmd.oauthId}`);
  }
}
