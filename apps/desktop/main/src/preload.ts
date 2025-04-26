import { contextBridge } from "electron";
import { logger } from "./util/logger.js";

logger.debug("preload: loaded");

const argvFiltered = process.argv.filter((entry) => entry !== "/prefetch:1");
const wsPort = parseInt(argvFiltered[argvFiltered.length - 1]);

contextBridge.exposeInMainWorld("EXPOSED", {
  webSocketPort: wsPort,
});
