import Electron from "electron";
import { logger } from "../util/logger.js";
import { configStore } from "../store/config-store.js";
import { AppContext, OnReady, OnReadyEvent } from "../util/lifecycle-events.js";

export class CheckCurrentUpdateChannelModule implements OnReady {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void> {
    logger.debug("CheckCurrentUpdateChannelModule");
    Electron.ipcMain.handle("IPC:on-updater-channel-requested", async () => {
      const channel = configStore.get("update.channel");
      return channel;
    });
  }
}
