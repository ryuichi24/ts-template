import { Logger } from "../Logger.js";

export class ConsoleLogStrategy extends Logger.BaseLogStrategy {
  log(level: Logger.LogLevel, message: string): void {
    if (this.shouldLog(level)) {
      const msg = `[${new Date().toUTCString()}][${Logger.LogLevel[level]}] ${message}`;
      console.log(msg);
    }
  }
}
