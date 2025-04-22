import Electron from "electron";
import { Store } from "@ts-template/store";

export const configStore = new Store<{
  update: {
    channel: string;
  };
}>({
  storePath: Electron.app.getPath("userData"),
  storeFileName: "user-config.json",
});
