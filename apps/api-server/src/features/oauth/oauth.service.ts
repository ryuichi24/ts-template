import crypto from "crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CacheService } from "../util/cache/cache.service";
import { OAuthAgentFactory } from "./agents/OAuthAgentFactory";
import { OAuthPlatformType, OAuthProviderType } from "./agents/OAuthAgent";
import { UserManager } from "../user/user.manager";

type OAuthAccount = {
  id: string;
  userId: string;
  oauthProvider: string;
  oauthId: string;
  createdAt: Date;
};

type OAuthSession = {
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: Date;
  createdAt: Date;
  oauthAccountId: string;
};

@Injectable()
export class OauthService {
  private _oauthAccounts: OAuthAccount[] = [];
  private _oauthSessions: OAuthSession[] = [];

  constructor(
    private _configService: ConfigService,
    private _userManger: UserManager,
    private _oauthAgentFactory: OAuthAgentFactory,
    private _jwtService: JwtService,
    private _cacheService: CacheService,
  ) {}

  public onLoginAttempt(platform: OAuthPlatformType, OAuthProviderType: OAuthProviderType) {
    const oauthProvider = this._oauthAgentFactory.create({ platform, provider: OAuthProviderType });
    const url = oauthProvider.makeLoginUrl();
    return url;
  }

  public async onLoginSuccess(platform: OAuthPlatformType, provider: OAuthProviderType, code: string) {
    const oauthProvider = this._oauthAgentFactory.create({ platform, provider });
    const authTokenResponse = await oauthProvider.getAuthTokens(code);
    // TODO: fetch the user info from the resource provider
    const userInfo = await oauthProvider.fetchUserInfo(authTokenResponse.accessToken);

    let existingUser = await this._userManger.getUserByEmail(userInfo.email);
    if (!existingUser) {
      // TODO: create a new user
      existingUser = await this._userManger.createUser({ email: userInfo.email, username: userInfo.name });
    }

    let existingOauthAccount = this._getOauthAccountByUserId(existingUser.id);
    if (!existingOauthAccount) {
      existingOauthAccount = await this._createOauthAccount({
        userId: existingUser.id,
        oauthId: userInfo.id,
        oauthProvider: provider,
      });
    }

    const oauthSession = await this._createOauthSession({
      email: userInfo.email,
      accessToken: authTokenResponse.accessToken,
      refreshToken: authTokenResponse.refreshToken,
      expiresIn: new Date(Date.now() + authTokenResponse.expiresIn * 1000),
      oauthAccountId: existingOauthAccount.id,
    });

    const successLoginUrl = oauthProvider.makeLoginSuccessUrl(oauthSession);
    return successLoginUrl;
  }

  private _getOauthAccountByUserId(userId: string) {
    return this._oauthAccounts.find((account) => account.userId === userId);
  }

  private async _createOauthAccount(createOauthDto: {
    userId: string;
    oauthId: string;
    oauthProvider: OAuthProviderType;
  }) {
    const newOauthAccount: OAuthAccount = {
      id: Math.random().toString(36).substring(7),
      ...createOauthDto,
      createdAt: new Date(),
    };
    this._oauthAccounts.push(newOauthAccount);

    return newOauthAccount;
  }

  private async _createOauthSession(createOauthSessionDto: {
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: Date;
    oauthAccountId: string;
  }) {
    const newOauthSession: OAuthSession = {
      id: crypto.randomUUID(),
      ...createOauthSessionDto,
      createdAt: new Date(),
    };
    this._oauthSessions.push(newOauthSession);

    const accessTokenExpiresIn = this._configService.getOrThrow<string>("auth.jwt.accessToken.expiresIn");
    const accessToken = this._jwtService.sign(
      { email: createOauthSessionDto.email, oauthSessionId: newOauthSession.id },
      {
        secret: this._configService.get("auth.jwt.accessToken.secret"),
        expiresIn: accessTokenExpiresIn,
      },
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const refreshTokenExpiresIn = this._configService.getOrThrow<string>("auth.jwt.refreshToken.expiresIn");
    this._cacheService.set(refreshToken, newOauthSession.id, refreshTokenExpiresIn);

    return { accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn: refreshTokenExpiresIn };
  }
}
