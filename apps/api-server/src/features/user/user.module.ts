import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserManager } from "./user.manager";

@Module({
  imports: [],
  exports: [UserManager],
  providers: [UserService, UserManager],
  controllers: [UserController],
})
export class UserModule {}
