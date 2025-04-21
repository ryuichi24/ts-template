import { ProcessEventEmitter } from "@ts-template/process-event-emitter";
import { logger } from "../../../background-server/src/utils/logger.js";

export class BackgroundWorkerManager {
  private static workers: Map<string, ProcessEventEmitter> = new Map();

  public static addWorker(workerId: string, worker: ProcessEventEmitter): void {
    if (BackgroundWorkerManager.workers.has(workerId)) {
      logger.debug(`Worker ${workerId} already exists.`);
      return;
    }
    BackgroundWorkerManager.workers.set(workerId, worker);
  }

  public static getOrThrow(workerId: string): ProcessEventEmitter {
    const worker = BackgroundWorkerManager.workers.get(workerId);
    if (!worker) {
      throw new Error(`Worker ${workerId} not found`);
    }
    return worker;
  }
}
