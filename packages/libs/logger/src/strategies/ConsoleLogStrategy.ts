import { Logger } from "../Logger.js";

export class ConsoleLogStrategy extends Logger.BaseLogStrategy {
  log({ level, message, loggerName, logPrefix }: Logger.LogPayload): void {
    if (this.shouldLog(level)) {
      const msg = `${logPrefix} ${message}`;
      console.log(msg);
    }
  }
}
