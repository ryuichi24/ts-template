import { AppStore } from "../utils/app-store.js";
import { MainProcessEventHandler } from "../utils/main-process-event-handler.js";

const mainProcess = new MainProcessEventHandler();

class InterceptorGet implements AppStore.CanIntercept {
  async intercept(key: string, value: any) {
    if (key === "refreshToken.value" || key === "accessToken.value") {
      return await this._decrypt(key, value);
    }
    return value;
  }

  private async _decrypt(key: string, value: string) {
    return await new Promise((res, rej) => {
      mainProcess.emit("on-decrypt-request", {
        key,
        value,
      });

      mainProcess.on("on-decrypt-response", (payload) => {
        if (payload.key === key) {
          res(payload.decrypted);
        }
      });
    });
  }
}

class InterceptorSet implements AppStore.CanIntercept {
  async intercept(key: string, value: any) {
    if (key === "refreshToken.value" || key === "accessToken.value") {
      return await this._encrypt(key, value);
    }
    return value;
  }

  private async _encrypt(key: string, value: string) {
    return await new Promise((res, rej) => {
      mainProcess.emit("on-encrypt-request", {
        key,
        value,
      });

      mainProcess.on("on-encrypt-response", (payload) => {
        if (payload.key === key) {
          res(payload.encrypted);
        }
      });
    });
  }
}

export const credentialStore = new AppStore<{
  refreshToken: {
    value: string;
    expiresAt: string;
  };
  accessToken: {
    value: string;
    expiresAt: string;
  };
}>({
  storePath: process.env.ELECTRON_USER_DATA_PATH,
  storeFileName: "credentials.json",
  interceptorGet: new InterceptorGet(),
  interceptorSet: new InterceptorSet(),
});
