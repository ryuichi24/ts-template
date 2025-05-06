import { Logger } from "@ts-template/logger";
import { logRepository } from "../../features/log-utils/repositories/log.repository.js";

export class DBLogStrategy extends Logger.BaseLogStrategy {
  private logQueue: Logger.LogPayload[] = [];

  constructor() {
    super();
    this.checkLogDbTableReady();
  }

  log(payload: Logger.LogPayload): void {
    this.logQueue.push(payload);
  }

  private checkLogDbTableReady() {
    const intervalRef = setInterval(async () => {
      const isReady = await logRepository.isReady();
      if (isReady) {
        this.start();
        clearInterval(intervalRef);
      }
    }, 1000 * 2);
  }

  private start() {
    setInterval(async () => {
      if (0 < this.logQueue.length) {
        await this.flush();
      }
    }, 1000 * 2);
  }

  async flush() {
    const logs = this.logQueue;
    this.logQueue = [];

    for (const log of logs) {
      const messages = `${log.messages.join(" ")}`;
      // Filter out Drizzle logs to avoid infinite loop
      if (messages.includes("[Drizzle]")) continue;

      await logRepository.create({
        name: log.loggerName,
        content: messages,
        level: log.level,
        loggedAt: log.nowDate,
      });
    }
  }
}
