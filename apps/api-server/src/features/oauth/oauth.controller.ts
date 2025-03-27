import { Controller, Get, HttpRedirectResponse, Param, Query, Redirect } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { OAuthPlatformType, OAuthProviderType } from "./agents/OAuthAgent";

@Controller("oauth")
export class OauthController {
  constructor(private readonly _oauthService: OauthService) {}

  // https://docs.nestjs.com/controllers#redirection
  @Get("login/:platform/:provider")
  @Redirect()
  async onLoginAttempt(@Param("platform") platform: OAuthPlatformType, @Param("provider") provider: OAuthProviderType) {
    const loginUrl = this._oauthService.onLoginAttempt(platform, provider);
    const redirectRes: HttpRedirectResponse = {
      url: loginUrl,
      statusCode: 302,
    };
    return redirectRes;
  }

  @Get("success/:platform/:provider")
  @Redirect()
  async onLoginSuccess(
    @Query("code") code: string,
    @Param("platform") platform: OAuthPlatformType,
    @Param("provider") provider: OAuthProviderType,
  ) {
    const successLoginUrl = await this._oauthService.onLoginSuccess(platform, provider, code);
    const redirectRes: HttpRedirectResponse = {
      url: successLoginUrl,
      statusCode: 302,
    };
    return redirectRes;
  }
}
