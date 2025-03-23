import Electron from "electron";
import { appConfig } from "../util/AppConfig.js";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { logger } from "../util/logger.js";

export class ChangeUpdateChannelModule implements IModule {
  onReady(appCtx: AppContext): void {
    Electron.ipcMain.handle("IPC:on-updater-channel-changed", async (evt, channel: string) => {
      appConfig.set("update.channel", channel);
    });
  }
}
