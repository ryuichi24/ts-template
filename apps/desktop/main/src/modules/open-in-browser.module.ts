import Electron from "electron";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { logger } from "../util/logger.js";

export class OpenInBrowserModule implements IModule {
  onReady(appCtx: AppContext): void {
    Electron.ipcMain.handle("IPC:on-open-in-browser-requested", async (evt, { url }) => {
      logger.debug(`Opening URL in browser: ${url}`);
      Electron.shell.openExternal(url);
    });
  }
}
