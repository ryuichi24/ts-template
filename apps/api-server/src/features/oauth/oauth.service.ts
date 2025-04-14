import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserManager } from "../user-util/managers/user.manager";
import { RefreshTokenManager } from "../auth-util/managers/refresh-token.manager";
import { calculateExpiresAt } from "@ts-template/date-util";
import { OAuthPlatformType, OAuthProviderType } from "../oauth-util/agents/oauth-agent";
import { OAuthAgentFactory } from "../oauth-util/agents/oauth-agent-factory";
import { OAuthAccountManager } from "../oauth-util/managers/oauth-account.manager";
import { OAuthTokenManager } from "../oauth-util/managers/oauth-token.manager";
import { ConfigService } from "../config/config.service";

export namespace OauthService {
  export type LoginAttemptDto = {
    platform: OAuthPlatformType;
    provider: OAuthProviderType;
  };
  export type completeLoginDto = {
    platform: OAuthPlatformType;
    provider: OAuthProviderType;
    code: string;
  };
}

@Injectable()
export class OauthService {
  constructor(
    private _configService: ConfigService,
    private _userManger: UserManager,
    private _oauthAgentFactory: OAuthAgentFactory,
    private _jwtService: JwtService,
    private _oauthAccountManager: OAuthAccountManager,
    private _oauthTokenManager: OAuthTokenManager,
    private _refreshTokenManager: RefreshTokenManager,
  ) {}

  public attemptLogin(dto: OauthService.LoginAttemptDto) {
    const oauthProvider = this._oauthAgentFactory.create({ platform: dto.platform, provider: dto.provider });
    const url = oauthProvider.makeLoginUrl();
    return url;
  }

  public async completeLogin(dto: OauthService.completeLoginDto) {
    const oauthProvider = this._oauthAgentFactory.create({ platform: dto.platform, provider: dto.provider });
    const authTokenResponse = await oauthProvider.getAuthTokens(dto.code);
    const userInfo = await oauthProvider.fetchUserInfo(authTokenResponse.accessToken);

    let existingUser = await this._userManger.getUserByEmail(userInfo.email);
    if (!existingUser) {
      existingUser = await this._userManger.createUser({
        email: userInfo.email,
        username: userInfo.username,
        isEmailVerified: userInfo.isEmailVerified,
        avatarUrl: userInfo.avatarUrl,
      });
    }

    let existingOauthAccount = await this._oauthAccountManager.getOAuthAccountByUserIdAndProvider({
      userId: existingUser.id,
      oauthProvider: dto.provider,
    });
    if (!existingOauthAccount) {
      existingOauthAccount = await this._oauthAccountManager.createOAuthAccount({
        userId: existingUser.id,
        oauthId: userInfo.id,
        provider: dto.provider,
      });
    }

    // check if the email of the oauth account is still valid if not update it
    if (existingUser.email !== userInfo.email) {
      existingUser = await this._userManger.updateUser({
        id: existingUser.id,
        data: {
          email: userInfo.email,
        },
      });
      //
    }

    // cache oauth token
    const oauthToken = await this._oauthTokenManager.getOAuthTokenByOauthId(existingOauthAccount.oauthId);

    // delete existing oauth token
    if (oauthToken) {
      await this._oauthTokenManager.deleteOAuthToken(oauthToken.id);
    }

    await this._oauthTokenManager.createOAuthToken({
      oauthId: userInfo.id,
      accessToken: authTokenResponse.accessToken,
      refreshToken: authTokenResponse.refreshToken,
      expiresIn: authTokenResponse.expiresIn,
    });

    // generate an access token and refresh token

    // NOTE: temporary role implementation
    const adminEmails = this._configService.getOrThrow("auth.admin.emails", { infer: true });
    const isAdmin = adminEmails.includes(existingUser.email);

    const accessTokenExpiresIn = this._configService.getOrThrow<string>("auth.jwt.accessToken.expiresIn", {
      infer: true,
    });
    const accessTokenPayload = {
      userId: existingUser.id,
      oauthId: existingOauthAccount.id,
      authProvider: dto.provider,
      roles: ["normal"],
      expiresAt: calculateExpiresAt(accessTokenExpiresIn).getTime(),
    };

    if (isAdmin) {
      accessTokenPayload.roles.push("admin");
    }

    const accessToken = this._jwtService.sign(accessTokenPayload, {
      secret: this._configService.get("auth.jwt.accessToken.secret", {
        infer: true,
      }),
      expiresIn: accessTokenExpiresIn,
    });
    const accessTokenExpiresAt = calculateExpiresAt(accessTokenExpiresIn);
    const refreshTokenExpiresIn = this._configService.getOrThrow<string>("auth.jwt.refreshToken.expiresIn", {
      infer: true,
    });
    const { refreshToken, expiresAt: refreshTokenExpiresAt } = this._refreshTokenManager.issue({
      userId: existingUser.id,
      authProvider: dto.provider,
      expiresIn: refreshTokenExpiresIn,
    });

    const successLoginUrl = oauthProvider.makeLoginSuccessUrl({
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });
    return successLoginUrl;
  }
}
