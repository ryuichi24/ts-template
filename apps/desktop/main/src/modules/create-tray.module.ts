import path from "path";
import { TrayManager } from "../util/TrayManager.js";
import { NodeJSCtx } from "@ts-template/node-js-ctx";
import Electron from "electron";
import { fileExist } from "@ts-template/file-system";
import { logger } from "../util/logger.js";
import { AppContext, OnReady, OnReadyEvent } from "../util/lifecycle-events.js";

export class CreateTrayModule implements OnReady {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void> {
    const theme = Electron.nativeTheme.shouldUseDarkColors === true ? "white" : "black";
    const trayIconPath = this._buildTrayIconPath(theme, appCtx.osSpecificAssetPath);
    const trayIconExists = fileExist(trayIconPath);
    if (!trayIconExists) {
      logger.debug(`Tray is not loaded. Tray icon does not exist: ${trayIconPath}`);
      return;
    }
    TrayManager.createTray(trayIconPath);

    const systemTray = TrayManager.getTray();

    const trayMenu = Electron.Menu.buildFromTemplate([
      {
        label: "Open",
        click: function () {},
      },
      {
        label: "Restart",
        click: function () {},
      },
      {
        label: "Quit",
        click: function () {},
      },
    ]);
    systemTray?.setContextMenu(trayMenu);

    systemTray?.setToolTip(appCtx.appName);

    /**
     * This enable clicking a tray icon quickly.
     * Electron stops emitting a click event to the system
     * when the tray icon gets clicks more than two times quickly
     */
    systemTray?.setIgnoreDoubleClickEvents(true);

    Electron.nativeTheme.on("updated", () => {
      const theme = Electron.nativeTheme.shouldUseDarkColors === true ? "white" : "black";
      const newTrayIconPath = this._buildTrayIconPath(theme, appCtx.osSpecificAssetPath);
      systemTray?.setImage(newTrayIconPath);
    });
  }

  private _buildTrayIconPath(theme: "white" | "black", osSpecificAssetsPath: string) {
    const osIconExt = NodeJSCtx.isWindows ? "ico" : "png";
    const trayIconDirPath = path.join(osSpecificAssetsPath, "icons", "tray");
    return path.join(trayIconDirPath, theme, `tray-icon-${theme}.${osIconExt}`);
  }
}
