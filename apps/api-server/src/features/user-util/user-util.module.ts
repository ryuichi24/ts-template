import { Module } from "@nestjs/common";
import { UserManager } from "./managers/user.manager";

@Module({
  exports: [UserManager],
  providers: [UserManager],
})
export class UserUtilModule {}
