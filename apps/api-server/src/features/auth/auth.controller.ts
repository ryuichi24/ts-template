import { Body, Controller, Get, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
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
  @ApiResponse({
    status: 200,
    description: "Refresh token response",
    schema: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        expiresAt: { type: "string", format: "date-time" },
      },
    },
  })
  async onRefreshToken(@Body() dto: AuthService.RefreshTokenDto) {
    const res = await this._authService.refreshToken(dto);
    if (!res) {
      throw new UnauthorizedException("Invalid token.");
    }

    return res;
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  @ApiBody({ schema: { type: "object", properties: { refreshToken: { type: "string" } } }, required: true })
  @ApiBearerAuth("Authorization")
  public async onLogout(@Body() dto: Omit<AuthService.LogoutDto, "authUser">, @AuthUser() authUser: AuthUser.User) {
    await this._authService.logout({ ...dto, authUser });
  }
}
