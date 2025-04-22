import Electron from "electron";
import { autoUpdater } from "electron-updater";
import { AppContext, OnReady, OnReadyEvent } from "../util/lifecycle-events.js";

export class checkForUpdatesModule implements OnReady {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void> {
    Electron.ipcMain.handle("IPC:on-update-check-requested", async (evt) => {
      autoUpdater.checkForUpdates();
    });
  }
}
