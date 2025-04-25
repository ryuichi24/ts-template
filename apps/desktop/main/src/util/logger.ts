import { Logger } from "@ts-template/logger";
import { ConsoleLogStrategy } from "@ts-template/logger/strategies";
import electronLogger from "electron-log";

electronLogger.transports.console.level = false;
class ElectronLogStrategy extends Logger.BaseLogStrategy {
  log({ level, messages, prefixes }: Logger.LogPayload): void {
    const logLevel = Logger.LogLevel[level].toLowerCase() as "info" | "warn" | "error" | "debug" | "fatal";
    const prefix = `${prefixes[0]}${prefixes[1]}${prefixes[2]}`;
    if (logLevel === "fatal") {
      electronLogger.error(prefix, ...messages);
      return;
    }
    electronLogger[logLevel](prefix, ...messages);
  }
}

export const consoleLogStrategy = new ConsoleLogStrategy();
export const electronLogStrategy = new ElectronLogStrategy();

export const logger = new Logger({ name: "main_process" })
  .addStrategy(consoleLogStrategy)
  .addStrategy(electronLogStrategy);

if (process.env.NODE_ENV === "development") {
  logger.setLevel(Logger.LogLevel.DEBUG);
}
