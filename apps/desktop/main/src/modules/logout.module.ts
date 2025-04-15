import Electron from "electron";
import { apiClient } from "../clients/api-client.js";
import { credentialStore } from "../store/credential-store.js";
import { AppWindowManager } from "../util/AppWindowManager.js";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { logger } from "../util/logger.js";

export class LogoutModule implements IModule {
  onReady(appCtx: AppContext): void {
    logger.debug("LogoutModule: onReady");
    Electron.ipcMain.handle("IPC:on-logout-requested", async (evt) => {
      try {
        const refreshToken = credentialStore.get("refreshToken.value");
        await apiClient.post("/auth/logout", {
          refreshToken,
        });

        credentialStore.delete("refreshToken");
        credentialStore.delete("accessToken");

        const mainWindow = AppWindowManager.getWindowOrThrow("main");
        mainWindow.webContents.send("IPC:logout-success", {});
      } catch (error) {
        logger.debug(`LogoutModule: Error ${error}`);
        // mainWindow.webContents.send("IPC:logout-fail", {
        //   userInfo: res.data,
        // });
      }
    });
  }
}
