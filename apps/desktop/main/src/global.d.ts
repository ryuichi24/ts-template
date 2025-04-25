import { BrowserWindow, Tray } from "electron";

// https://stackoverflow.com/a/53981706
declare global {
  namespace NodeJS {
    interface ProcessEnv {}
  }
}

declare global {
  /**
   * A main instance of the application window
   */
  var mainWindow: BrowserWindow | null;
  /**
   * A tray object must live in a global scope otherwise the tray icon sometimes disappears
   */
  var tray: Tray | null;
  /**
   * It is for quitting the system properly.
   * This tracks the system being requested to quit by the OS or other ways other than clicking the close button
   */
  var systemQuitState: "NOT_PENDING" | "PENDING" | "APPROVED";
  /**
   * TEMP: This is a temporary flag to change the release channel dynamically for the auto-updater
   */
  var TST_AUTO_UPDATER_RELEASE_CHANNEL: string;
  /**
   *
   */
  var TST_ELECTRON_APP_NAME: appName;
}
