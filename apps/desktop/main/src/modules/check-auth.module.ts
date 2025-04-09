import Electron from "electron";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { apiClient } from "../clients/api-client.js";
import { AppWindowManager } from "../util/AppWindowManager.js";

export class CheckAuthModule implements IModule {
  onReady(appCtx: AppContext): void {
    Electron.ipcMain.handle("IPC:on-check-auth-requested", async (evt) => {
      const res = await apiClient.get("/auth/me");
      const mainWindow = AppWindowManager.getWindowOrThrow("main");
      mainWindow.webContents.send("IPC:oauth-login-success", {
        userInfo: res.data,
      });
    });
  }
}
