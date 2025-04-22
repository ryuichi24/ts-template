import path from "path";
import { NodeJSCtx } from "@ts-template/node-js-ctx";
import { AppWindowManager } from "../util/AppWindowManager.js";
import { AppContext, OnReady, OnReadyEvent } from "../util/lifecycle-events.js";

export class LoadMainWindowModule implements OnReady {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void> {
    // NOTE: while the main module type is ESM but `require` can be used since esbuild adds a script making a custom `require`
    const rendererFilePath = NodeJSCtx.isDebug
      ? require.resolve("@ts-template/desktop-renderer/dist/index.html")
      : path.resolve(appCtx.rootDir, "..", "desktop-renderer", "index.html");
    const rendererDevServerURL = `http://localhost:${process.env.TST_DESKTOP_RENDERER_DEV_SERVER_PORT || 5555}`;
    const mainWindow = AppWindowManager.getWindowOrThrow("main");

    if (NodeJSCtx.isDev) {
      mainWindow.loadURL(rendererDevServerURL);
      /**
       * This opens the devtool in the application window but it emits some warnings below:
       * ```
       * @ts-template/desktop-main:dev: [14052:0305/173019.550077:ERROR:CONSOLE(1)] "Request Autofill.enable failed. {"code":-32601,"message":"'Autofill.enable' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
       * @ts-template/desktop-main:dev: [14052:0305/173019.550098:ERROR:CONSOLE(1)] "Request Autofill.setAddresses failed. {"code":-32601,"message":"'Autofill.setAddresses' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
       * ```
       *
       * As a workaround, you can comment out this line but the warnings have no impact on the application.
       */
      // https://github.com/electron/electron/issues/41614
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
}
