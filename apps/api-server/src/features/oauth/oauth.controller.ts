import { Controller, Get, HttpRedirectResponse, Param, Query, Redirect } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { OAuthPlatformType, OAuthProviderType } from "./agents/OAuthAgent";
import { ApiParam, ApiQuery, ApiResponse, ApiBearerAuth, ApiOAuth2 } from "@nestjs/swagger";

@Controller("oauth")
export class OauthController {
  constructor(private readonly _oauthService: OauthService) {}

  // https://docs.nestjs.com/controllers#redirection
  @Get("login/:platform")
  @Redirect()
  @ApiParam({ name: "platform", type: String, required: true, enum: ["desktop", "mobile", "web"] })
  @ApiQuery({ name: "provider", type: String, required: true, enum: ["google", "github", "discord"] })
  @ApiResponse({ status: 302, description: "Redirect to authorization server" })
  async onLoginAttempt(@Param("platform") platform: OAuthPlatformType, @Query("provider") provider: OAuthProviderType) {
    const loginUrl = this._oauthService.onLoginAttempt(platform, provider);
    const redirectRes: HttpRedirectResponse = {
      url: loginUrl,
      statusCode: 302,
    };
    return redirectRes;
  }

  @Get("success/:platform")
  @Redirect()
  @ApiParam({ name: "platform", type: String, required: true, enum: ["desktop", "mobile", "web"] })
  @ApiQuery({ name: "provider", type: String, required: true, enum: ["google", "github", "discord"] })
  @ApiResponse({ status: 302, description: "Redirect to the application" })
  async onLoginSuccess(
    @Param("platform") platform: OAuthPlatformType,
    @Query("provider") provider: OAuthProviderType,
    @Query("code") code: string,
  ) {
    const successLoginUrl = await this._oauthService.onLoginSuccess(platform, provider, code);
    const redirectRes: HttpRedirectResponse = {
      url: successLoginUrl,
      statusCode: 302,
    };
    return redirectRes;
  }
}
