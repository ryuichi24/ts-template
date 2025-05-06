import { LogRepositoryDrizzle } from "./log.repository.drizzle.js";
import { LogRepository } from "./log.repository.interface.js";

export const logRepository = new LogRepositoryDrizzle() as LogRepository;
