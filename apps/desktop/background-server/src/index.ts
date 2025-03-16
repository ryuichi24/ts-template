import Database from "better-sqlite3";
import { logger } from "./utils/logger.js";

new Database("test.db");

logger.info("Starting background server process.");
