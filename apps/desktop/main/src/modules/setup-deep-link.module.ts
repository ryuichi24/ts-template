import path from "path";
import Electron from "electron";
import { registerProtocol } from "@ts-template/electron-app-protocol";
import { BackgroundWorkerManager } from "../util/background-worker-manager.js";
import { AppContext, OnOpenUrl, OnOpenUrlEvent, OnReady, OnReadyEvent } from "../util/lifecycle-events.js";

// https://dev.to/rwwagner90/launching-electron-apps-from-the-browser-59oc
// https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
export class SetupDeepLinkModule implements OnReady, OnOpenUrl {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void> {
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

  onOpenUrl(evt: OnOpenUrlEvent, appCtx: AppContext): void | Promise<void> {
    const redirectUrl = evt.url;
    const bgServer = BackgroundWorkerManager.getOrThrow("background-server");

    console.log("SetupDeepLinkModule onOpenUrl", redirectUrl);

    bgServer.emit("on-oauth-login-success-redirect", {
      redirectUrl,
    });
  }
}
