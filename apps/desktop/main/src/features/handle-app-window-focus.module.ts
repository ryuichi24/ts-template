import { AppWindowManager } from "../util/AppWindowManager.js";
import { BackgroundWorkerManager } from "../util/background-worker-manager.js";
import { AppContext, OnReady, OnReadyEvent } from "../util/lifecycle-events.js";

export class HandleAppWindowFocusModule implements OnReady {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void> {
    const bgServer = BackgroundWorkerManager.getOrThrow("background-server");
    bgServer.on("on-app-window-focus-request", (payload) => {
      const { id } = payload;
      const appWindow = AppWindowManager.getWindowOrThrow(id);
      appWindow.focus();
    });
  }
}
