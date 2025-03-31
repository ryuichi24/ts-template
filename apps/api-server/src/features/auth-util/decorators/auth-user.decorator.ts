import { createParamDecorator } from "@nestjs/common";
import { OAuthProviderType } from "src/features/oauth/agents/oauth-agent";

export namespace AuthUser {
  export type User = {
    id: string;
    iat: number;
    exp: number;
  } & (CustomAuthUser | OAuthUser);

  type CustomAuthUser = {
    authProvider: "custom";
  };

  type OAuthUser = {
    authProvider: OAuthProviderType;
    oauthId: string;
  };
}

export const AuthUser = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
