import { Body, Controller, Get, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { AuthUser } from "../auth-util/decorators/auth-user.decorator";
import { AuthGuard } from "../auth-util/guards/auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("Authorization")
  public async onAuthUserCheck(@AuthUser() authUser: AuthUser.User) {
    const res = await this._authService.checkUserAuth({
      authUser,
    });
    if (!res) {
      throw new UnauthorizedException("Invalid token.");
    }

    return res.user;
  }

  @Post("refresh-token")
  @ApiBody({ schema: { type: "object", properties: { refreshToken: { type: "string" } } }, required: true })
  async onRefreshToken(@Body() dto: AuthService.RefreshTokenDto) {
    const res = await this._authService.refreshToken(dto);
    if (!res) {
      throw new UnauthorizedException("Invalid token.");
    }

    return res;
  }
}
