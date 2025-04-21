import Electron from "electron";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { logger } from "../util/logger.js";
import { BackgroundWorkerManager } from "../util/background-worker-manager.js";

export class OpenInBrowserModule implements IModule {
  onReady(appCtx: AppContext): void {
    const bgServer = BackgroundWorkerManager.getOrThrow("background-server");
    bgServer.on("on-open-in-browser-requested", (payload) => {
      const url = payload.url;
      logger.debug(`Opening URL in browser: ${url}`);
      Electron.shell.openExternal(url);
    });
  }
}
