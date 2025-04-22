import Electron from "electron";
import { logger } from "../util/logger.js";
import { configStore } from "../store/config-store.js";
import { AppContext, OnReady, OnReadyEvent } from "../util/lifecycle-events.js";

export class ChangeUpdateChannelModule implements OnReady {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void> {
    Electron.ipcMain.handle("IPC:on-updater-channel-changed", async (evt, channel: string) => {
      configStore.set("update.channel", channel);
    });
  }
}
