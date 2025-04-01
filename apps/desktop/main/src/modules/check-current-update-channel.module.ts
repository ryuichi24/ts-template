import Electron from "electron";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { logger } from "../util/logger.js";
import { configStore } from "../store/config-store.js";

export class CheckCurrentUpdateChannelModule implements IModule {
  onReady(appCtx: AppContext): void {
    logger.debug("CheckCurrentUpdateChannelModule");
    Electron.ipcMain.handle("IPC:on-updater-channel-requested", async () => {
      const channel = configStore.get("update.channel");
      return channel;
    });
  }
}
