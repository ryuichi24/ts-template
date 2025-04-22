import path from "path";
import Electron from "electron";
import { autoUpdater } from "electron-updater";
import { NodeJSCtx } from "@ts-template/node-js-ctx";
import {
  AppContext,
  CanConstructModule,
  hasOnActivate,
  hasOnBeforeQuit,
  hasOnBootstrap,
  hasOnOpenUrl,
  hasOnQuit,
  hasOnReady,
  hasOnSecondInstance,
  hasOnWindowAllClosed,
  IModule,
} from "./lifecycle-events.js";

type AppOptions = {
  appName: string;
  assetPath: string;
  devAssetPath: string;
  rootDir: string;
};

interface IElectronApp {
  start(options: AppOptions): Promise<void>;
}

class ElectronFactory {
  static create(moduleContainer: CanConstructModule[]): IElectronApp {
    const modules = moduleContainer.map((module) => new module());
    return new ElectronApp(modules);
  }
}

class ElectronApp implements IElectronApp {
  constructor(private modules: IModule[]) {}

  public async start(options: AppOptions) {
    const appCtx = this._buildAppCtx(options);

    this._preventMultipleAppInstances();
    this._configureUserDataFolderName(options.appName);

    Electron.app.on("ready", async ($evt) => {
      await Promise.all(this.modules.map((module) => hasOnBootstrap(module) && module.onBootstrap({ $evt }, appCtx)));
      this.modules.forEach((module) => hasOnReady(module) && module.onReady({ $evt }, appCtx));
    });

    // app events handlers
    Electron.app.on("quit", ($evt, exitCode) => {
      this.modules.forEach((module) => hasOnQuit(module) && module.onQuit({ $evt, exitCode }, appCtx));
    });

    Electron.app.on("before-quit", ($evt) => {
      this.modules.forEach((module) => hasOnBeforeQuit(module) && module.onBeforeQuit({ $evt }, appCtx));
    });

    Electron.app.on("window-all-closed", () => {
      this.modules.forEach((module) => hasOnWindowAllClosed(module) && module.onWindowAllClosed({}, appCtx));
    });

    Electron.app.on("activate", ($evt) => {
      this.modules.forEach((module) => hasOnActivate(module) && module.onActivate({ $evt }, appCtx));
    });

    Electron.app.on("open-url", ($evt, url) => {
      $evt.preventDefault();
      this.modules.forEach((module) => hasOnOpenUrl(module) && module.onOpenUrl({ $evt, url }, appCtx));
    });

    Electron.app.on("second-instance", ($evt, argv, workingDirectory, additionalData) => {
      this.modules.forEach(
        (module) =>
          hasOnSecondInstance(module) &&
          module.onSecondInstance?.({ $evt, argv, workingDirectory, additionalData }, appCtx),
      );
    });
  }

  private _buildAppCtx(options: AppOptions): AppContext {
    const osName = NodeJSCtx.isMac ? "mac" : NodeJSCtx.isWindows ? "windows" : "linux";
    const assetPath = Electron.app.isPackaged ? options.assetPath : options.devAssetPath;
    const appVersion = Electron.app.getVersion();
    const appVersionFromAutoUpdater = autoUpdater.currentVersion;
    return {
      ...options,
      appVersion,
      appVersionFromAutoUpdater,
      isPackaged: Electron.app.isPackaged,
      assetPath,
      osSpecificAssetPath: path.join(assetPath, osName),
      userDataPath: Electron.app.getPath("userData"),
    };
  }

  private _preventMultipleAppInstances() {
    const isSingleInstance = Electron.app.requestSingleInstanceLock();
    if (!isSingleInstance) {
      Electron.app.quit();
      return;
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
  private _configureUserDataFolderName(folderName: string) {
    const appData = Electron.app.getPath("appData");
    Electron.app.setPath("userData", path.join(appData, folderName));
  }
}

export { ElectronFactory };
