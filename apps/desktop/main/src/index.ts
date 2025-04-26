import path from "path";
import Electron from "electron";
import { ElectronFactory } from "./util/electron-factory.js";
import { LoadMainWindowModule } from "./features/load-main-window.module.js";
import { CreateTrayModule } from "./features/create-tray.module.js";
import { OpenInBrowserModule } from "./features/open-in-browser.module.js";
import { StartChildProcessesModule } from "./features/start-child-processes.module.js";
import { SetupAutoUpdaterModule } from "./features/setup-auto-updater.module.js";
import { SetupDeepLinkModule } from "./features/setup-deep-link.module.js";
import { HandleAppWindowFocusModule } from "./features/handle-app-window-focus.module.js";
import { HandleOSLevelEncryptionModule } from "./features/handle-os-level-encryption.module.js";

if (require("electron-squirrel-startup")) Electron.app.quit();

/**
 * Initialize custom global variables
 */
global.systemQuitState = "NOT_PENDING";

const APP_NAME = TST_ELECTRON_APP_NAME ?? "ts-template";

async function bootstrap() {
  const app = ElectronFactory.create([
    StartChildProcessesModule,
    HandleAppWindowFocusModule,
    LoadMainWindowModule,
    HandleOSLevelEncryptionModule,
    CreateTrayModule,
    OpenInBrowserModule,
    SetupAutoUpdaterModule,
    SetupDeepLinkModule,
  ]);

  await app.start({
    appName: APP_NAME,
    assetPath: path.join(__dirname, "..", "desktop-main", "assets"),
    devAssetPath: path.join("dist", "assets"),
    rootDir: path.resolve(__dirname),
  });
}
bootstrap();
