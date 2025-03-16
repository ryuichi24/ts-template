import { Logger } from "@ts-template/logger";
import { ConsoleLogStrategy } from "@ts-template/logger/strategies";

const consoleLogStrategy = new ConsoleLogStrategy();
export const logger = new Logger({ name: "renderer_process" }).addStrategy(consoleLogStrategy);
