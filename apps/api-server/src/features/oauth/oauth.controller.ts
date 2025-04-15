import { Controller, Get, HttpRedirectResponse, Param, Query, Redirect } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { ApiParam, ApiResponse } from "@nestjs/swagger";
import { OAuthPlatformType, OAuthProviderType } from "../oauth-util/agents/oauth-agent";

@Controller("oauth")
export class OauthController {
  constructor(private readonly _oauthService: OauthService) {}

  // https://docs.nestjs.com/controllers#redirection
  @Get("login/:platform/:provider")
  @Redirect()
  @ApiParam({ name: "platform", type: String, required: true, enum: ["desktop", "mobile", "web"] })
  @ApiParam({ name: "provider", type: String, required: true, enum: ["google", "github", "discord"] })
  @ApiResponse({ status: 302, description: "Redirect to authorization server" })
  async onLoginAttempt(@Param("platform") platform: OAuthPlatformType, @Param("provider") provider: OAuthProviderType) {
    const loginUrl = this._oauthService.attemptLogin({ platform, provider });
    const redirectRes: HttpRedirectResponse = {
      url: loginUrl,
      statusCode: 302,
    };
    return redirectRes;
  }

  @Get("success/:platform/:provider")
  @Redirect()
  @ApiParam({ name: "platform", type: String, required: true, enum: ["desktop", "mobile", "web"] })
  @ApiParam({ name: "provider", type: String, required: true, enum: ["google", "github", "discord"] })
  @ApiResponse({ status: 302, description: "Redirect to the application" })
  async onLoginSuccess(
    @Param("platform") platform: OAuthPlatformType,
    @Param("provider") provider: OAuthProviderType,
    @Query("code") code: string,
  ) {
    const successLoginUrl = await this._oauthService.completeLogin({ platform, provider, code });
    const redirectRes: HttpRedirectResponse = {
      url: successLoginUrl,
      statusCode: 302,
    };
    return redirectRes;
  }
}
