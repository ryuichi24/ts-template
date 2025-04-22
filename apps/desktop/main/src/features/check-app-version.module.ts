import Electron from "electron";
import { AppContext, OnReady, OnReadyEvent } from "../util/lifecycle-events.js";

export class CheckAppVersionModule implements OnReady {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void> {
    Electron.ipcMain.handle("IPC:on-app-version-requested", async () => {
      const appVersion = appCtx.appVersion;
      const appVersionFromAutoUpdater = appCtx.appVersionFromAutoUpdater;
      return { appVersion, appVersionFromAutoUpdater };
    });
  }
}
