import { Logger } from "@ts-template/logger";
import { ConsoleLogStrategy } from "@ts-template/logger/strategies";
import { DBLogStrategy } from "./strategies/db-log-strategy.js";

const consoleLogStrategy = new ConsoleLogStrategy();
const dBLogStrategy = new DBLogStrategy();

export const logger = new Logger({ name: "background_server_process" })
  .addStrategy(consoleLogStrategy)
  .addStrategy(dBLogStrategy);

if (process.env.NODE_ENV === "development") {
  logger.setLevel(Logger.LogLevel.DEBUG);
}
