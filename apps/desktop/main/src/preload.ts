import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("IPC", {
    appVersionRequested: () => ipcRenderer.invoke("IPC:app-version-requested"),
})