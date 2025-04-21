import { BrowserWindow, Tray } from "electron";

// https://stackoverflow.com/a/53981706
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ELECTRON_USER_DATA_PATH: string;
    }
  }
}

declare global {}
