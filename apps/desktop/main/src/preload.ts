import { ipcRenderer, contextBridge } from "electron";
import { logger } from "./util/logger.js";

logger.debug("preload: loaded");

const argvFiltered = process.argv.filter((entry) => entry !== "/prefetch:1");
const wsPort = parseInt(argvFiltered[argvFiltered.length - 1]);

contextBridge.exposeInMainWorld("EXPOSED", {
  webSocketPort: wsPort,
  IPC: {
    onAppVersionRequested: () => ipcRenderer.invoke("IPC:on-app-version-requested"),
    onUpdaterChannelRequested: () => ipcRenderer.invoke("IPC:on-updater-channel-requested"),
    onUpdaterChannelChanged: (channel: string) => ipcRenderer.invoke("IPC:on-updater-channel-changed", { channel }),
    onUpdateCheckRequested: () => ipcRenderer.invoke("IPC:on-update-check-requested"),
  },
});
