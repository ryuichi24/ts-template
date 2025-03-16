import path from "path";
import { app, nativeTheme, dialog } from "electron";
import log from "electron-log";
import electronUpdaterPkg from "electron-updater";
import { AppWindow } from "./AppWindow.js";
import { appConfig } from "./AppConfig.js";
const { autoUpdater } = electronUpdaterPkg;
autoUpdater.logger = log;

export namespace Application {
  export type Props = {
    appName: string;
    assetDirBasePath?: string;
  };
}

export class Application {
  private _app: Electron.App;
  private _appName: string;
  private _appWindowMap: Map<string, AppWindow> = new Map();
  private _isInDebugMode = process.env.NODE_ENV === "debug";
  private _isInDevMode = process.env.NODE_ENV === "development";

  // native theme

  // OS flags
  private _isMac = process.platform === "darwin";
  private _isWindows = process.platform === "win32";
  private _isLinux = process.platform === "linux";
  private _osName = this._isMac ? "mac" : this._isWindows ? "windows" : "linux";

  // asset paths
  private _osSpecificAssetsPath = path.resolve(__dirname, "..", "assets", process.platform);
  private _logoIconPath?: string;
  private _trayIconPath?: string;

  constructor(props?: Application.Props) {
    this._app = app;
    this._appName = props?.appName ?? "Electron";

    if (props?.appName) {
      this._configureUserDataFolderName(props.appName);
    }

    if (props?.assetDirBasePath) {
      this._buildAssetPaths(props?.assetDirBasePath);
    }
  }

  /**
   * Configures the user data folder name.
   *
   * `appData`:
   *  - mac => `/Users/<user>/Library/Application Support`
   *  - windows => `C:\Users\<user>\AppData\Roaming`
   *  - linux => `/home/<user>/.config`
   *
   * `userData`:
   *  - mac => `/Users/<user>/Library/Application Support/<app name>`
   *  - windows => `C:\Users\<user>\AppData\Roaming\<app name>`
   *  - linux => `/home/<user>/.config/<app name>`
   *
   * @param name User Data Folder Name
   */
  private _configureUserDataFolderName(name: string) {
    const appData = app.getPath("appData");
    app.setPath("userData", path.join(appData, name));
  }

  private _buildAssetPaths(assetDirBasePath: string) {
    this._osSpecificAssetsPath = this._buildOSSpecificAssetPath(assetDirBasePath);
    this._logoIconPath = this._buildLogoIconPath(this._osSpecificAssetsPath);
    const theme = nativeTheme.shouldUseDarkColors === true ? "white" : "black";
    this._trayIconPath = this._buildTrayIconPath(theme, this._osSpecificAssetsPath);
  }

  private _buildOSSpecificAssetPath(assetDirBasePath: string) {
    return path.join(assetDirBasePath, this._osName);
  }

  private _buildLogoIconPath(osSpecificAssetsPath: string) {
    const osIconName = this._isMac ? "logo.icns" : this._isWindows ? "logo.ico" : "logo.png";
    return path.join(osSpecificAssetsPath, "icons", "logo", osIconName);
  }

  private _buildTrayIconPath(theme: "white" | "black", osSpecificAssetsPath: string) {
    const osIconExt = this._isWindows ? "ico" : "png";
    const trayIconDirPath = path.join(osSpecificAssetsPath, "icons", "tray");
    return path.join(trayIconDirPath, theme, `tray-icon-${theme}.${osIconExt}`);
  }

  public onNativeThemeChange(callback: (args: { newTrayIconPath: string }) => void) {
    nativeTheme.on("updated", () => {
      const theme = nativeTheme.shouldUseDarkColors === true ? "white" : "black";
      const newTrayIconPath = this._buildTrayIconPath(theme, this._osSpecificAssetsPath);
      callback({ newTrayIconPath });
    });
    return this;
  }

  public async waitForReady() {
    await this._app.whenReady();
  }

  public addAppWindow(appWindowKey: AppWindow.AppWindowKey, window: AppWindow) {
    this._appWindowMap.set(appWindowKey, window);
  }

  private _getAppWindow(appWindowKey: AppWindow.AppWindowKey) {
    const window = this._appWindowMap.get(appWindowKey);
    if (!window) {
      throw new Error(`AppWindow with key ${appWindowKey} is not found.`);
    }
    return window;
  }

  public launchedAppWindow(appWindowKey: AppWindow.AppWindowKey) {
    const window = this._getAppWindow(appWindowKey);

    if (this.isInDevMode()) {
      window.loadDevAppWindow();
      window.openDevTools();
      return;
    }

    window.loadAppWindow();
  }

  public openAppWindow(appWindowKey: AppWindow.AppWindowKey) {
    const window = this._getAppWindow(appWindowKey);
    window.show();
  }

  public attachAutoUpdaterToAppWindow(appWindowKey: AppWindow.AppWindowKey) {
    const appWindow = this._getAppWindow(appWindowKey);
    autoUpdater.allowPrerelease = true;
    autoUpdater.autoInstallOnAppQuit = false;
    // https://www.electron.build/tutorials/release-using-channels.html
    autoUpdater.channel = appConfig.get("update.channel") ?? "latest";

    const globalAppWindowInstance = appWindow.getGlobalInstance();
    autoUpdater.addListener("update-downloaded", (event) => {
      if (!globalAppWindowInstance) return;

      dialog
        .showMessageBox(globalAppWindowInstance, {
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

    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      console.log(err);
    })
  }

  public hideDock() {
    if (this._isMac) {
      app.dock?.hide();
    }
  }

  public async showDock() {
    if (this._isMac) {
      await app.dock?.show();
    }
  }

  public restart() {
    app.relaunch();
    app.quit();
  }

  public quit() {
    app.quit();
  }

  public isInDebugMode() {
    return this._isInDebugMode;
  }

  public isInDevMode() {
    return this._isInDevMode;
  }

  get logoIconPath() {
    if (!this._logoIconPath) {
      throw new Error("Logo icon path is not set.");
    }
    return this._logoIconPath;
  }

  get trayIconPath() {
    if (!this._trayIconPath) {
      throw new Error("Tray icon path is not set.");
    }
    return this._trayIconPath;
  }

  get isMac() {
    return this._isMac;
  }

  get appName() {
    return this._appName;
  }

  // app events
  onBeforeQuit(callback: () => void) {
    this._app.on("before-quit", callback);
    return this;
  }

  onQuit(callback: () => void) {
    this._app.on("quit", callback);
    return this;
  }

  onWindowAllClosed(callback: () => void) {
    this._app.on("window-all-closed", callback);
    return this;
  }

  onActivate(callback: () => void) {
    this._app.on("activate", callback);
    return this;
  }
}

function terminateOnErr(err: Error) {
  log.error("electron:err");
  log.error(err);
  log.error(err.stack);
  global.mainWindow = null;
  tray?.destroy();
  app.quit();
}

process.on("uncaughtException", terminateOnErr);
