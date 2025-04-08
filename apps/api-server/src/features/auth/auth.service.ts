import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { UserManager } from "../user-util/managers/user.manager";
import { AuthUser } from "../auth-util/decorators/auth-user.decorator";
import { RefreshTokenManager } from "../auth-util/managers/refresh-token.manager";
import { calculateExpiresAt } from "@ts-template/date-util";
import { OauthApiClientFactory } from "../oauth-util/clients/oauth-api-client-factory";
import { OAuthAccountManager } from "../oauth-util/managers/oauth-account.manager";
import { OAuthTokenManager } from "../oauth-util/managers/oauth-token.manager";

export namespace AuthService {
  export type CheckUserAuthDto = {
    authUser: AuthUser.User;
  };

  export type RefreshTokenDto = {
    refreshToken: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private _configService: ConfigService,
    private _jwtService: JwtService,
    private _userManger: UserManager,
    private _oauthAccountManager: OAuthAccountManager,
    private _oauthApiClientFactory: OauthApiClientFactory,
    private _oauthTokenManager: OAuthTokenManager,
    private _refreshTokenManager: RefreshTokenManager,
  ) {}

  public async checkUserAuth(dto: AuthService.CheckUserAuthDto) {
    const existingUser = await this._userManger.getUserById(dto.authUser.id);
    if (!existingUser) {
      return null;
    }

    // If the user is using OAuth, we need to check if the OAuth account exists
    if (dto.authUser.authProvider !== "custom") {
      const existingOAuthAccount = await this._oauthAccountManager.getOAuthAccountByUserIdAndProvider({
        userId: existingUser.id.toString(),
        oauthProvider: dto.authUser.authProvider,
      });
      if (!existingOAuthAccount) {
        return null;
      }
    }

    return { user: existingUser };
  }

  public async refreshToken(dto: AuthService.RefreshTokenDto) {
    const refreshTokenPayload = this._refreshTokenManager.verify(dto);
    if (!refreshTokenPayload) {
      return null;
    }

    const existingUser = await this._userManger.getUserById(refreshTokenPayload.userId);

    if (!existingUser) {
      return null;
    }

    // verify if the user's oauth account is still valid
    if (refreshTokenPayload.authProvider !== "custom") {
      const existingOauthAccount = await this._oauthAccountManager.getOAuthAccountByUserIdAndProvider({
        userId: existingUser.id,
        oauthProvider: refreshTokenPayload.authProvider,
      });

      if (!existingOauthAccount) {
        return null;
      }

      const oauthAccessToken = await this._oauthTokenManager.getOAuthTokenByOauthId(existingOauthAccount.oauthId);
      if (!oauthAccessToken) {
        return null;
      }

      const oauthApiClient = this._oauthApiClientFactory.create(refreshTokenPayload.authProvider);
      // fetch the user info from the google api
      let userInfo = await oauthApiClient.requestUserInfo(oauthAccessToken.accessToken);
      // check if the email of the oauth account is the same as the one in the user info
      if (existingUser.email !== userInfo.email) {
        // revoke the refresh token
        return null;
      }
    }

    const accessTokenExpiresIn = this._configService.getOrThrow<string>("auth.jwt.accessToken.expiresIn", {
      infer: true,
    });
    const accessTokenPayload = {
      userId: existingUser.id,
      authProvider: refreshTokenPayload.authProvider,
    };
    const accessTokenOptions = {
      secret: this._configService.get("auth.jwt.accessToken.secret", { infer: true }),
      expiresIn: accessTokenExpiresIn,
    };
    const accessTokenExpiresAt = calculateExpiresAt(accessTokenExpiresIn);

    const accessToken = this._jwtService.sign(accessTokenPayload, accessTokenOptions);

    return { accessToken, expiresAt: accessTokenExpiresAt };
  }
}
