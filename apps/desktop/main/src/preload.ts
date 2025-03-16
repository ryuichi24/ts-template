import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("IPC", {
  onAppVersionRequested: () => ipcRenderer.invoke("IPC:on-app-version-requested"),
  onUpdaterChannelRequested: () => ipcRenderer.invoke("IPC:on-updater-channel-requested"),
  onUpdaterChannelChanged: (channel: string) => ipcRenderer.invoke("IPC:on-updater-channel-changed", { channel }),
  onUpdateCheckRequested: () => ipcRenderer.invoke("IPC:on-update-check-requested"),
});
