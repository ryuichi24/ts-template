import { Injectable } from "@nestjs/common";
import { UserManager } from "./user.manager";

export namespace UserService {
  export type RequestUserInfoDto = {
    email: string;
  };
}

@Injectable()
export class UserService {
  constructor(private _userManager: UserManager) {}

  public async requestUserInfo(dto: UserService.RequestUserInfoDto) {
    const user = await this._userManager.getUserByEmail(dto.email);
    if (!user) {
      throw new Error("User not found");
    }

    return { user };
  }
}
