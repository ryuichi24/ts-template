import Electron from "electron";
import { autoUpdater } from "electron-updater";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { AppWindowManager } from "../util/AppWindowManager.js";
import { configStore } from "../store/config-store.js";

export class SetupAutoUpdaterModule implements IModule {
  onReady(appCtx: AppContext): void {
    const updateChannel = configStore.get("update.channel") ?? "latest";
    autoUpdater.allowPrerelease = updateChannel !== "latest";
    autoUpdater.autoInstallOnAppQuit = false;
    // https://www.electron.build/tutorials/release-using-channels.html
    autoUpdater.channel = updateChannel;

    const mainWindow = AppWindowManager.getWindowOrThrow("main");
    // downloaded files are stored in the following directories:
    // mac: /Users/{user}/Library/Caches/{app name}-updater
    // windows: /c/Users/{user}/AppData/Local/{app name}-updater
    // linux: /home/{user}/.cache/{app name}-updater
    autoUpdater.addListener("update-downloaded", (event) => {
      Electron.dialog
        .showMessageBox(mainWindow, {
          type: "info",
          buttons: ["Restart", "Later"],
          message: "UPDATE",
          detail: "A new version has been downloaded. Restart the application to apply the updates.",
        })
        .then((result) => {
          if (result.response === 0) {
            global.systemQuitState = "APPROVED";
            autoUpdater.quitAndInstall();
          }
        });
    });
  }
}
