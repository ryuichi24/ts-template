import Electron from "electron";
import { appConfig } from "../util/AppConfig.js";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { logger } from "../util/logger.js";

export class CheckCurrentUpdateChannelModule implements IModule {
  onReady(appCtx: AppContext): void {
    logger.debug("CheckCurrentUpdateChannelModule");
    Electron.ipcMain.handle("IPC:on-updater-channel-requested", async () => {
      const channel = appConfig.get("update.channel");
      logger.debug(`Current update channel: ${channel}`);
      return channel;
    });
  }
}
