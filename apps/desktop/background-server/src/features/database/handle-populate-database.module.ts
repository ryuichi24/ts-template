import path from "path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { AppContext, OnWSServerDidReceiveEvent, OnWSServerDidReceiveEventEvent } from "../../utils/lifecycle-events.js";
import { drizzleClient } from "../../db/drizzle/drizzle-client.js";

const devMigrationFolder = path.join(__dirname, "..", "db-migrations", "sqlite");
const prodMigrationFolder = path.join(__dirname, "db-migrations", "sqlite");

export class HandlePopulateDatabaseModule implements OnWSServerDidReceiveEvent {
  event: string = "on-renderer-process-ready";

  async onWSServerDidReceiveEvent(evt: OnWSServerDidReceiveEventEvent, appCtx: AppContext): Promise<void> {
    appCtx.logger.debug("on-renderer-process-ready event received");

    appCtx.logger.debug("******************** Populating database... ********************");
    appCtx.logger.debug(
      "DB Migration path: ",
      process.env.NODE_ENV === "development" ? devMigrationFolder : prodMigrationFolder,
    );

    migrate(drizzleClient, {
      migrationsFolder: process.env.NODE_ENV === "development" ? devMigrationFolder : prodMigrationFolder,
    });

    appCtx.logger.debug("******************** Database populated ********************");
  }
}
