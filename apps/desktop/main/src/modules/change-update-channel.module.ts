import Electron from "electron";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { logger } from "../util/logger.js";
import { configStore } from "../store/config-store.js";

export class ChangeUpdateChannelModule implements IModule {
  onReady(appCtx: AppContext): void {
    Electron.ipcMain.handle("IPC:on-updater-channel-changed", async (evt, channel: string) => {
      configStore.set("update.channel", channel);
    });
  }
}
