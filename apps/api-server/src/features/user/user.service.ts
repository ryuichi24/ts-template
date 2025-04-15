import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "../user-util/repositories/user.repository";

export namespace UserService {}

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private _userRepository: UserRepository,
  ) {}
}
