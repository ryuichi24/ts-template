import crypto from "crypto";
import { calculateExpiresAt } from "@ts-template/date-util";
import { ConfigService } from "src/features/config/config.service";
import { CacheManager } from "src/features/util/cache/cache.manager";
import { Injectable } from "@nestjs/common";
import { OAuthProviderType } from "src/features/oauth-util/agents/oauth-agent";

export namespace RefreshTokenManager {
  export type VerifyDto = {
    refreshToken: string;
  };

  export type IssueDto = {
    userId: string;
    authProvider: OAuthProviderType | "custom";
    expiresIn: string | number;
  };

  export type TokenPayload = {
    userId: string;
    authProvider: OAuthProviderType | "custom";
    expiresAt: Date;
  };
}

@Injectable()
export class RefreshTokenManager {
  constructor(
    private _cacheManager: CacheManager,
    private _configService: ConfigService,
  ) {}

  public issue(dto: RefreshTokenManager.IssueDto) {
    const refreshTokenExpiresIn = this._configService.getOrThrow<string>("auth.jwt.refreshToken.expiresIn", {
      infer: true,
    });
    const refreshTokenExpiresAt = calculateExpiresAt(refreshTokenExpiresIn);
    const refreshToken = crypto.randomBytes(40).toString("hex");
    this._cacheManager.set(
      `refreshToken:${refreshToken}`,
      {
        userId: dto.userId,
        authProvider: dto.authProvider,
        expiresAt: refreshTokenExpiresAt,
      },
      refreshTokenExpiresIn,
    );

    return { refreshToken, expiresAt: refreshTokenExpiresAt };
  }

  public verify(dto: RefreshTokenManager.VerifyDto) {
    const refreshTokenPayload = this._cacheManager.get<RefreshTokenManager.TokenPayload>(
      `refreshToken:${dto.refreshToken}`,
    );
    if (!refreshTokenPayload) {
      return null;
    }

    return refreshTokenPayload;
  }
}
