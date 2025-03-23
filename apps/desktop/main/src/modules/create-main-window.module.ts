import path from "path";
import { NodeJSCtx } from "@ts-template/node-js-ctx";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { logger } from "../util/logger.js";
import { AppWindowManager } from "../util/AppWindowManager.js";

export class CreateMainWindowModule implements IModule {
  onReady(appCtx: AppContext): void {
    logger.debug("CreateMainWindowModule: onReady");
    const preloadScriptPath = path.resolve(appCtx.rootDir, "preload.mjs");
    const iconPath = this._buildLogoIconPath(appCtx.osSpecificAssetPath);

    logger.debug("Making a main window: onReady");
    AppWindowManager.createWindow("main", {
      minWidth: 1408,
      minHeight: 848,
      width: 1408,
      height: 848 + (NodeJSCtx.isDev || NodeJSCtx.isDebug ? 630 : 0),
      icon: iconPath,
      resizable: NodeJSCtx.isDev || NodeJSCtx.isDebug,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        // https://developer.mamezou-tech.com/blogs/2022/08/03/electron-renderer-process-sandboxed/
        sandbox: false,
        preload: preloadScriptPath,
        additionalArguments: [],
        devTools: NodeJSCtx.isDev || NodeJSCtx.isDebug,
      },
    });

    logger.debug("Making a main window is done: onReady");

    // NOTE: while the main module type is ESM but `require` can be used since esbuild adds a script making a custom `require`
    const rendererFilePath = NodeJSCtx.isDebug
      ? require.resolve("@ts-template/desktop-renderer/dist/index.html")
      : path.resolve(appCtx.rootDir, "..", "desktop-renderer", "index.html");
    const rendererDevServerURL = `http://localhost:${process.env.TST_DESKTOP_RENDERER_DEV_SERVER_PORT || 5555}`;
    const mainWindow = AppWindowManager.getWindowOrThrow("main");

    if (NodeJSCtx.isDev) {
      mainWindow.loadURL(rendererDevServerURL);
      mainWindow.webContents.openDevTools();
    }

    if (NodeJSCtx.isDebug) {
      mainWindow.loadFile(rendererFilePath);
      mainWindow.webContents.openDevTools();
    }

    if (appCtx.isPackaged) {
      mainWindow.loadFile(rendererFilePath);
    }
  }

  private _buildLogoIconPath(osSpecificAssetsPath: string) {
    const osIconName = NodeJSCtx.isMac ? "logo.icns" : NodeJSCtx.isWindows ? "logo.ico" : "logo.png";
    return path.join(osSpecificAssetsPath, "icons", "logo", osIconName);
  }
}
