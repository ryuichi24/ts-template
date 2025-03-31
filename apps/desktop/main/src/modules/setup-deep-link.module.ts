import path from "path";
import { URL } from "url";
import Electron from "electron";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { AppWindowManager } from "../util/AppWindowManager.js";
import { logger } from "../util/logger.js";

// https://dev.to/rwwagner90/launching-electron-apps-from-the-browser-59oc
// https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
export class SetupDeepLinkModule implements IModule {
  onReady(appCtx: AppContext): void {
    const protocol = appCtx.appName.toLocaleLowerCase();
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        Electron.app.setAsDefaultProtocolClient(protocol, process.execPath, [path.resolve(process.argv[1])]);
      }
    } else {
      Electron.app.setAsDefaultProtocolClient(protocol);
    }
  }

  onOpenUrl(appCtx: AppContext, event: Electron.Event, url: string): void {
    const protocol = appCtx.appName.toLocaleLowerCase();
    const appUrl = `${protocol}://`;
    logger.info(`onOpenUrl: ${url}`);
    const parsedUrl = new URL(url);
    const accessToken = parsedUrl.searchParams.get("access_token");
    const refreshToken = parsedUrl.searchParams.get("refresh_token");
    const accessTokenExpiresAt = parsedUrl.searchParams.get("access_token_expires_at");
    const refreshTokenExpiresAt = parsedUrl.searchParams.get("refresh_token_expires_at");

    const mainWindow = AppWindowManager.getWindowOrThrow("main");
    mainWindow.webContents.send("IPC:oauth-login-success", {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });
    mainWindow.focus();

    if (url.startsWith(appUrl)) {
      Electron.dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
    }
  }
}
