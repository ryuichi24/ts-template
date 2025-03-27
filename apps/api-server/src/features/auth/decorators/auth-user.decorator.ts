import { createParamDecorator } from "@nestjs/common";

export const AuthUser = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
