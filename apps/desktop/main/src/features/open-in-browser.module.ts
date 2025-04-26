import Electron from "electron";
import { BackgroundWorkerManager } from "../util/background-worker-manager.js";
import { AppContext, OnReady, OnReadyEvent } from "../util/lifecycle-events.js";

export class OpenInBrowserModule implements OnReady {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void> {
    const bgServer = BackgroundWorkerManager.getOrThrow("background-server");
    bgServer.on("on-open-in-browser-requested", (payload) => {
      const url = payload.url;
      appCtx.logger.debug(`Opening URL in browser: ${url}`);
      Electron.shell.openExternal(url);
    });
  }
}
