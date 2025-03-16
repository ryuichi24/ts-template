import { Logger } from "@ts-template/logger";
import { ConsoleLogStrategy } from "@ts-template/logger/strategies";
import electronLogger from "electron-log";

class ElectronLogStrategy extends Logger.BaseLogStrategy {
  log({ level, message, loggerName, logPrefix }: Logger.LogPayload): void {
    const logLevel = Logger.LogLevel[level].toLowerCase() as "info" | "warn" | "error" | "debug" | "fatal";
    const logMessage = `${logPrefix} ${message}`;
    if (logLevel === "fatal") {
      electronLogger.error(`[FATAL] ${logMessage}`);
      return;
    }
    electronLogger[logLevel](logMessage);
  }
}

export const consoleLogStrategy = new ConsoleLogStrategy();
export const electronLogStrategy = new ElectronLogStrategy();

export const logger = new Logger({ name: "main_process" })
  .addStrategy(consoleLogStrategy)
  .addStrategy(electronLogStrategy);
