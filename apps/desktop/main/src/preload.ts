import { ipcRenderer, contextBridge } from "electron";
import { logger } from "./util/logger.js";

logger.debug("preload: loaded");

contextBridge.exposeInMainWorld("IPC", {
  onAppVersionRequested: () => ipcRenderer.invoke("IPC:on-app-version-requested"),
  onUpdaterChannelRequested: () => ipcRenderer.invoke("IPC:on-updater-channel-requested"),
  onUpdaterChannelChanged: (channel: string) => ipcRenderer.invoke("IPC:on-updater-channel-changed", { channel }),
  onUpdateCheckRequested: () => ipcRenderer.invoke("IPC:on-update-check-requested"),
  onOpenInBrowserRequested: (url: string) => ipcRenderer.invoke("IPC:on-open-in-browser-requested", { url }),
  onOauthLoginSuccess: (
    callback: (payload: { accessToken: string; refreshToken: string; idToken: string; expiresIn: string }) => void,
  ) => ipcRenderer.on("IPC:oauth-login-success", (_event, value) => callback(value)),
  onCheckAuthRequested: () => ipcRenderer.invoke("IPC:on-check-auth-requested"),
  onLogoutRequested: () => ipcRenderer.invoke("IPC:on-logout-requested"),
  onLogoutSuccess: (callback: () => void) => ipcRenderer.on("IPC:logout-success", () => callback()),
});
