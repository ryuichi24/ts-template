import path from "path";
import { fork } from "child_process";
import { NodeJSCtx } from "@ts-template/node-js-ctx";
import { AppContext, IModule } from "../util/ElectronFactory.js";
import { BackgroundServerProcessEventHandler } from "../util/background-server-process-event-handler.js";
import { AppWindowManager } from "../util/AppWindowManager.js";
import { BackgroundWorkerManager } from "../util/background-worker-manager.js";

export class StartChildProcessesModule implements IModule {
  async onBootstrap(appCtx: AppContext): Promise<void> {
    const runningPort = await new Promise<number>((res, rej) => {
      // bg server start
      const serverFilePath =
        NodeJSCtx.isDev || NodeJSCtx.isDebug
          ? require.resolve("@ts-template/desktop-background-server/dist/index.js")
          : path.resolve(appCtx.rootDir, "..", "desktop-background-server", "index.js");

      const childProcess = fork(serverFilePath, [], {
        env: {
          FORK: "1",
          ELECTRON_USER_DATA_PATH: appCtx.userDataPath,
          ELECTRON_USER_RESOURCES_PATH: process.resourcesPath,
          ELECTRON_APP_CONTENTS_PATH: path.resolve(process.resourcesPath, ".."),
          NODE_ENV: process.env.NODE_ENV,
          PATH: process.env.PATH,
        },
        stdio: "inherit",
      });

      const bgServer = new BackgroundServerProcessEventHandler(childProcess);

      bgServer.on("bg-server-started", ({ port }) => {
        res(port);
      });

      bgServer.on("error", (err) => {
        rej(err);
      });

      BackgroundWorkerManager.addWorker("background-server", bgServer);
    });

    const preloadScriptPath = path.resolve(appCtx.rootDir, "preload.mjs");
    const iconPath = this._buildLogoIconPath(appCtx.osSpecificAssetPath);

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
        additionalArguments: [runningPort.toString()],
        devTools: NodeJSCtx.isDev || NodeJSCtx.isDebug,
      },
    });
  }

  private _buildLogoIconPath(osSpecificAssetsPath: string) {
    const osIconName = NodeJSCtx.isMac ? "logo.icns" : NodeJSCtx.isWindows ? "logo.ico" : "logo.png";
    return path.join(osSpecificAssetsPath, "icons", "logo", osIconName);
  }
}
