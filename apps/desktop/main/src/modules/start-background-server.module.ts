import path from "path";
import { fork } from "child_process";
import { NodeJSCtx } from "@ts-template/node-js-ctx";
import { AppContext, IModule } from "../util/ElectronFactory.js";

export class StartBackgroundServerModule implements IModule {
  onReady(appCtx: AppContext): void {
    // bg server start
    const serverFilePath =
      NodeJSCtx.isDev || NodeJSCtx.isDebug
        ? require.resolve("@ts-template/desktop-background-server/dist/index.js")
        : path.resolve(__dirname, "..", "desktop-background-server", "index.js");

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
  }
}
