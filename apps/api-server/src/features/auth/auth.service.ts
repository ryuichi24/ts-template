import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { AuthUser } from "../auth-util/decorators/auth-user.decorator";
import { RefreshTokenManager } from "../auth-util/managers/refresh-token.manager";
import { calculateExpiresAt } from "@ts-template/date-util";
import { OauthApiClientFactory } from "../oauth-util/clients/oauth-api-client-factory";
import { OauthAccountRepository } from "../oauth-util/repositories/oauth-account.repository";
import { OauthTokenRepository } from "../oauth-util/repositories/oauth-token.repository";
import { UserRepository } from "../user-util/repositories/user.repository";

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
    private _refreshTokenManager: RefreshTokenManager,
    private _oauthApiClientFactory: OauthApiClientFactory,

    @Inject(UserRepository)
    private _userRepository: UserRepository,

    @Inject(OauthAccountRepository)
    private _oauthAccountRepository: OauthAccountRepository,

    @Inject(OauthTokenRepository)
    private _oauthTokenRepository: OauthTokenRepository,
  ) {}

  public async checkUserAuth(dto: AuthService.CheckUserAuthDto) {
    const existingUser = await this._userRepository.getById({
      id: dto.authUser.id,
    });
    if (!existingUser) {
      return null;
    }

    // If the user is using OAuth, we need to check if the OAuth account exists
    if (dto.authUser.authProvider !== "custom") {
      const existingOAuthAccount = await this._oauthAccountRepository.getByUserIdAndProvider({
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
    const refreshTokenPayload = await this._refreshTokenManager.verify(dto);
    if (!refreshTokenPayload) {
      return null;
    }

    const existingUser = await this._userRepository.getById({
      id: refreshTokenPayload.userId,
    });

    if (!existingUser) {
      return null;
    }

    const accessTokenPayload: any = {
      userId: existingUser.id,
      authProvider: refreshTokenPayload.authProvider,
      roles: ["normal"],
    };

    const adminEmails = this._configService.getOrThrow("auth.admin.emails", { infer: true });
    const isAdmin = adminEmails.includes(existingUser.email);
    if (isAdmin) {
      accessTokenPayload.roles.push("admin");
    }

    // verify if the user's oauth account is still valid
    if (refreshTokenPayload.authProvider !== "custom") {
      const existingOauthAccount = await this._oauthAccountRepository.getByUserIdAndProvider({
        userId: existingUser.id,
        oauthProvider: refreshTokenPayload.authProvider,
      });

      if (!existingOauthAccount) {
        return null;
      }

      const oauthAccessToken = await this._oauthTokenRepository.getByOauthId({ oauthId: existingOauthAccount.oauthId });
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

      accessTokenPayload.oauthId = existingOauthAccount.oauthId;
    }

    const accessTokenExpiresIn = this._configService.getOrThrow<string>("auth.jwt.accessToken.expiresIn", {
      infer: true,
    });

    const accessTokenOptions = {
      secret: this._configService.get("auth.jwt.accessToken.secret", { infer: true }),
      expiresIn: accessTokenExpiresIn,
    };
    const accessTokenExpiresAt = calculateExpiresAt(accessTokenExpiresIn);
    accessTokenPayload.expiresAt = accessTokenExpiresAt;

    const accessToken = this._jwtService.sign(accessTokenPayload, accessTokenOptions);

    return { accessToken, expiresAt: accessTokenExpiresAt };
  }
}
