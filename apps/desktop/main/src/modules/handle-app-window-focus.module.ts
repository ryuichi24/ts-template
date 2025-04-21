import { AppWindowManager } from "../util/AppWindowManager.js";
import { BackgroundWorkerManager } from "../util/background-worker-manager.js";
import { AppContext, IModule } from "../util/ElectronFactory.js";

export class HandleAppWindowFocusModule implements IModule {
  async onReady(appCtx: AppContext): Promise<void> {
    const bgServer = BackgroundWorkerManager.getOrThrow("background-server");
    bgServer.on("on-app-window-focus-request", (payload) => {
      const { id } = payload;
      const appWindow = AppWindowManager.getWindowOrThrow(id);
      appWindow.focus();
    });
  }
}
