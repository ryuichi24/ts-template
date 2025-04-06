import path from "path";
import { URL } from "url";
import Electron from "electron";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { AppWindowManager } from "../util/AppWindowManager.js";
import { logger } from "../util/logger.js";
import { credentialStore } from "../store/credential-store.js";
import axios from "axios";
import { registerProtocol } from "@ts-template/electron-app-protocol";

// https://dev.to/rwwagner90/launching-electron-apps-from-the-browser-59oc
// https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
export class SetupDeepLinkModule implements IModule {
  onReady(appCtx: AppContext): void {
    const protocol = appCtx.appName.toLocaleLowerCase();

    // register a custom protocol for dev mode since in dev mode, the deep link will not work
    if (!appCtx.isPackaged) {
      registerProtocol(protocol);
    }

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
    const parsedUrl = new URL(url);
    const accessToken = parsedUrl.searchParams.get("access_token");
    const refreshToken = parsedUrl.searchParams.get("refresh_token");
    const accessTokenExpiresAt = parsedUrl.searchParams.get("access_token_expires_at");
    const refreshTokenExpiresAt = parsedUrl.searchParams.get("refresh_token_expires_at");

    if (!accessToken || !refreshToken || !accessTokenExpiresAt || !refreshTokenExpiresAt) {
      logger.error("Invalid OAuth Login Success URL");
      return;
    }

    credentialStore.set("accessToken.value", accessToken);
    credentialStore.set("accessToken.expiresAt", accessTokenExpiresAt);
    credentialStore.set("refreshToken.value", refreshToken);
    credentialStore.set("refreshToken.expiresAt", refreshTokenExpiresAt);

    axios("http://localhost:3000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      const mainWindow = AppWindowManager.getWindowOrThrow("main");
      mainWindow.webContents.send("IPC:oauth-login-success", {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        userInfo: res.data,
      });
      mainWindow.focus();
    });
  }
}

// const api = axios.create({ baseURL: "/api", withCredentials: true });

// api.interceptors.request.use(async (config) => {
//   const { accessToken, refreshAccessToken } = useAuth();

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   } else {
//     await refreshAccessToken();
//   }

//   return config;
// });

// api.interceptors.response.use(null, async (error) => {
//   if (error.response?.status === 401) {
//     await refreshAccessToken();
//     return api(error.config); // Retry request
//   }
//   return Promise.reject(error);
// });
