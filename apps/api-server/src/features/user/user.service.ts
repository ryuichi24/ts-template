import { Injectable } from "@nestjs/common";
import { UserManager } from "../user-util/managers/user.manager";

export namespace UserService {}

@Injectable()
export class UserService {
  constructor(private _userManager: UserManager) {}
}
