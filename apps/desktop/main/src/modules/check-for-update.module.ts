import Electron from "electron";
import { autoUpdater } from "electron-updater";
import { AppContext, IModule } from "../util/ElectronFactory.js";

export class checkForUpdatesModule implements IModule {
  onReady(appCtx: AppContext): void {
    Electron.ipcMain.handle("IPC:on-update-check-requested", async (evt) => {
      autoUpdater.checkForUpdates();
    });
  }
}
