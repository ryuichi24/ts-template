import Electron from "electron";
import { BackgroundWorkerManager } from "../util/background-worker-manager.js";
import { AppContext, IModule } from "../util/ElectronFactory.js";

export class HandleOSLevelEncryptionModule implements IModule {
  onReady(appCtx: AppContext): void {
    const bgServer = BackgroundWorkerManager.getOrThrow("background-server");

    bgServer.on("on-encrypt-request", (payload) => {
      const { value, key } = payload;
      if (!Electron.safeStorage.isEncryptionAvailable()) {
        // TODO: use node crypto instead
        throw new Error("Encryption is not available on this machine.");
      }
      const buffer = Electron.safeStorage.encryptString(value.toString());
      const encrypted = buffer.toString("base64");
      bgServer.emit("on-encrypt-response", {
        encrypted,
        key,
      });
    });

    bgServer.on("on-decrypt-request", (payload) => {
      const { value, key } = payload;
      const buffer = Buffer.from(value, "base64");
      const decrypted = Electron.safeStorage.decryptString(buffer);
      bgServer.emit("on-decrypt-response", {
        decrypted,
        key,
      });
    });
  }
}
