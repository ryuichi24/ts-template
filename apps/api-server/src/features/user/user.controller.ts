import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { AuthUser } from "../auth/decorators/auth-user.decorator";
import { UserService } from "./user.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("users")
export class UserController {
  constructor(private _userService: UserService) {}

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("Access Token")
  public async onAuthUserCheck(@AuthUser() authUser: any) {
    const res = await this._userService.requestUserInfo({ email: authUser.email });
    return res.user;
  }
}
