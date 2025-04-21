import path from "path";
import Electron from "electron";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { registerProtocol } from "@ts-template/electron-app-protocol";
import { BackgroundWorkerManager } from "../util/background-worker-manager.js";

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
    const redirectUrl = url;
    const bgServer = BackgroundWorkerManager.getOrThrow("background-server");
    
    console.log("SetupDeepLinkModule onOpenUrl", redirectUrl);

    bgServer.emit("on-oauth-login-success-redirect", {
      redirectUrl,
    });
  }
}
