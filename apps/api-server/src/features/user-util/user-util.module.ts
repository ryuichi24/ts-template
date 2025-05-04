import { Module } from "@nestjs/common";
import { StrapiModule } from "../strapi/strapi.module";
import { UserRepository } from "./repositories/user.repository";
import { UserStrapiRepository } from "./repositories/user-strapi.repository";
import { UserInMemoryRepository } from "./repositories/user-in-memory.repository";
import { StrapiClient } from "../strapi/clients/strapi.client";
import { UserInDbRepository } from "./repositories/user-in-db.repository";

@Module({
  imports: [StrapiModule],
  exports: [UserRepository],
  providers: [
    {
      provide: UserRepository,
      useClass: UserInDbRepository,
    },
    // {
    //   provide: UserRepository,
    //   useFactory: async (strapiClient: StrapiClient) => {
    //     const isStrapiRunning = await strapiClient.isRunning();
    //     if (isStrapiRunning) {
    //       return new UserStrapiRepository(strapiClient);
    //     }
    //     return new UserInMemoryRepository();
    //   },
    //   inject: [StrapiClient],
    // },
  ],
})
export class UserUtilModule {}
