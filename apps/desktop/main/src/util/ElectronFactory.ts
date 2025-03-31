import path from "path";
import Electron from "electron";
import { autoUpdater } from "electron-updater";
import { NodeJSCtx } from "@ts-template/node-js-ctx";

export interface IConstructor<TInstance> {
  new (...args: any[]): TInstance;
}

export interface IModuleConstructor extends IConstructor<IModule> {}

export interface IModule {
  onReady?(appCtx: AppContext): void;
  onQuit?(appCtx: AppContext, event: Electron.Event, exitCode: number): void;
  onBeforeQuit?(appCtx: AppContext, event: Electron.Event): void;
  onWindowAllClosed?(appCtx: AppContext): void;
  onActivate?(appCtx: AppContext, event: Electron.Event): void;
  onOpenUrl?(appCtx: AppContext, event: Electron.Event, url: string): void;
  onSecondInstance?(appCtx: AppContext, event: Electron.Event, commandLine: string[], workingDirectory: string): void;
}

type AppOptions = {
  appName: string;
  assetPath: string;
  devAssetPath: string;
  rootDir: string;
};

export type AppContext = {
  appName: string;
  appVersion: string;
  appVersionFromAutoUpdater: string;
  isPackaged: boolean;
  assetPath: string;
  osSpecificAssetPath: string;
  userDataPath: string;
  rootDir: string;
};

interface IElectronApp {
  start(options: AppOptions): Promise<void>;
}

class ElectronFactory {
  static create(moduleContainer: IModuleConstructor[]): IElectronApp {
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

    Electron.app.on("ready", () => {
      this.modules.forEach((module) => module.onReady?.(appCtx));
    });

    // app events handlers
    Electron.app.on("quit", (event, exitCode) => {
      this.modules.forEach((module) => module.onQuit?.(appCtx, event, exitCode));
    });

    Electron.app.on("before-quit", (event) => {
      this.modules.forEach((module) => module.onBeforeQuit?.(appCtx, event));
    });

    Electron.app.on("window-all-closed", () => {
      this.modules.forEach((module) => module.onWindowAllClosed?.(appCtx));
    });

    Electron.app.on("activate", (event) => {
      this.modules.forEach((module) => module.onActivate?.(appCtx, event));
    });

    Electron.app.on("open-url", (event, url) => {
      event.preventDefault();
      this.modules.forEach((module) => module.onOpenUrl?.(appCtx, event, url));
    });

    Electron.app.on("second-instance", (event, commandLine, workingDirectory) => {
      this.modules.forEach((module) => module.onSecondInstance?.(appCtx, event, commandLine, workingDirectory));
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
