import { AppStore } from "../util/AppStore.js";

export const configStore = new AppStore<{
  update: {
    channel: string;
  };
}>();
