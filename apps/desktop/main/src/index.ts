import path from "path";
import Electron from "electron";
import { ElectronFactory } from "./util/ElectronFactory.js";
import { LoadMainWindowModule } from "./modules/load-main-window.module.js";
import { CreateTrayModule } from "./modules/create-tray.module.js";
import { OpenInBrowserModule } from "./modules/open-in-browser.module.js";
import { StartChildProcessesModule } from "./modules/start-child-processes.module.js";
import { CheckCurrentUpdateChannelModule } from "./modules/check-current-update-channel.module.js";
import { ChangeUpdateChannelModule } from "./modules/change-update-channel.module.js";
import { CheckAppVersionModule } from "./modules/check-app-version.module.js";
import { checkForUpdatesModule } from "./modules/check-for-update.module.js";
import { SetupAutoUpdaterModule } from "./modules/setup-auto-updater.module.js";
import { SetupDeepLinkModule } from "./modules/setup-deep-link.module.js";
import { HandleAppWindowFocusModule } from "./modules/handle-app-window-focus.module.js";
import { HandleOSLevelEncryptionModule } from "./modules/handle-os-level-encryption.module.js";

if (require("electron-squirrel-startup")) Electron.app.quit();

/**
 * Initialize custom global variables
 */
global.systemQuitState = "NOT_PENDING";

const APP_NAME = process.env.TST_ELECTRON_APP_NAME ?? "ts-template";

async function bootstrap() {
  const app = ElectronFactory.create([
    StartChildProcessesModule,
    HandleAppWindowFocusModule,
    LoadMainWindowModule,
    HandleOSLevelEncryptionModule,
    CreateTrayModule,
    OpenInBrowserModule,
    CheckCurrentUpdateChannelModule,
    ChangeUpdateChannelModule,
    CheckAppVersionModule,
    checkForUpdatesModule,
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
