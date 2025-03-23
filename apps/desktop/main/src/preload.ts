import { ipcRenderer, contextBridge } from "electron";
import { logger } from "./util/logger.js";

logger.debug("preload: loaded");

contextBridge.exposeInMainWorld("IPC", {
  onAppVersionRequested: () => ipcRenderer.invoke("IPC:on-app-version-requested"),
  onUpdaterChannelRequested: () => ipcRenderer.invoke("IPC:on-updater-channel-requested"),
  onUpdaterChannelChanged: (channel: string) => ipcRenderer.invoke("IPC:on-updater-channel-changed", { channel }),
  onUpdateCheckRequested: () => ipcRenderer.invoke("IPC:on-update-check-requested"),
  onOpenInBrowserRequested: (url: string) => ipcRenderer.invoke("IPC:on-open-in-browser-requested", { url }),
});
