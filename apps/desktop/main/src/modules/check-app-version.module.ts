import Electron from "electron";
import { AppContext, IModule } from "../util/ElectronFactory.js";

export class CheckAppVersionModule implements IModule {
  onReady(appCtx: AppContext): void {
    Electron.ipcMain.handle("IPC:on-app-version-requested", async () => {
      const appVersion = appCtx.appVersion;
      const appVersionFromAutoUpdater = appCtx.appVersionFromAutoUpdater;
      return { appVersion, appVersionFromAutoUpdater };
    });
  }
}
