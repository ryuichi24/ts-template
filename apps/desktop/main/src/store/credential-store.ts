import { AppStore } from "../util/AppStore.js";
import Electron from "electron";

class InterceptorGet implements AppStore.CanIntercept {
  intercept(key: string, value: any) {
    if (!Electron.safeStorage.isEncryptionAvailable()) {
      throw new Error("Encryption is not available on this machine.");
    }
    const buffer = Buffer.from(value, "base64");
    return Electron.safeStorage.decryptString(buffer);
  }
}

class InterceptorSet implements AppStore.CanIntercept {
  intercept(key: string, value: any) {
    if (!Electron.safeStorage.isEncryptionAvailable()) {
      throw new Error("Encryption is not available on this machine.");
    }
    const buffer = Electron.safeStorage.encryptString(value.toString());
    return buffer.toString("base64");
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
  storeFileName: "credentials.json",
  interceptorGet: new InterceptorGet(),
  interceptorSet: new InterceptorSet(),
});
