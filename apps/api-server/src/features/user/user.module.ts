import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserUtilModule } from "../user-util/user-util.module";

@Module({
  exports: [],
  imports: [UserUtilModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
