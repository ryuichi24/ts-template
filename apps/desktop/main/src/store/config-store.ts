import Electron from "electron";
import { AppStore } from "../util/app-store.js";

export const configStore = new AppStore<{
  update: {
    channel: string;
  };
}>({
  storePath: Electron.app.getPath("userData"),
  storeFileName: "user-config.json",
});
