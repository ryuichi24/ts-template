import crypto from "crypto";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { calculateExpiresAt } from "@ts-template/date-util";
import { OAuthProviderType } from "src/features/oauth-util/agents/oauth-agent";
import { CacheService } from "src/features/util/cache/cache.service";
import { RefreshTokenCache } from "../../cache/refresh-token-cache";

export namespace RefreshTokenService {
  export type VerifyDto = {
    refreshToken: string;
  };

  export type IssueDto = {
    userId: string;
    authProvider: OAuthProviderType | "custom";
    expiresIn: string | number;
  };

  export type RevokeDto = {
    refreshToken: string;
  };

  export type TokenPayload = {
    userId: string;
    authProvider: OAuthProviderType | "custom";
    expiresAt: Date;
  };
}

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(RefreshTokenCache) private _cacheService: CacheService,
    private _configService: ConfigService,
  ) {}

  public async issue(dto: RefreshTokenService.IssueDto) {
    const refreshTokenExpiresIn = this._configService.getOrThrow<string>("auth.jwt.refreshToken.expiresIn", {
      infer: true,
    });
    const refreshTokenExpiresAt = calculateExpiresAt(refreshTokenExpiresIn);
    const refreshToken = crypto.randomBytes(40).toString("hex");
    await this._cacheService.set(
      `refreshToken:${refreshToken}`,
      {
        userId: dto.userId,
        authProvider: dto.authProvider,
        expiresAt: refreshTokenExpiresAt,
      },
      { expiresIn: refreshTokenExpiresIn },
    );

    return { refreshToken, expiresAt: refreshTokenExpiresAt };
  }

  public async verify(dto: RefreshTokenService.VerifyDto) {
    const refreshTokenPayload = await this._cacheService.get(`refreshToken:${dto.refreshToken}`);
    if (!refreshTokenPayload) {
      return null;
    }

    return refreshTokenPayload;
  }

  public async revoke(dto: RefreshTokenService.RevokeDto) {
    await this._cacheService.delete(`refreshToken:${dto.refreshToken}`);
  }
}
