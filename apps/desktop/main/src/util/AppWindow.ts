import { BrowserWindow } from "electron";

export namespace AppWindow {
  export type AppWindowKey = "mainWindow";
  export type constructorArgs = {
    appWindowId: "mainWindow";
    options: Electron.BrowserWindowConstructorOptions;
    rendererLocation: {
      devServerUrl: string;
      staticFilePath: string;
    };
  };
}
export class AppWindow {
  private _appWindowId: AppWindow.AppWindowKey;
  private _rendererLocation: AppWindow.constructorArgs["rendererLocation"];
  constructor(args: AppWindow.constructorArgs) {
    this._rendererLocation = args.rendererLocation;
    this._appWindowId = args.appWindowId;
    global[this._appWindowId] = new BrowserWindow(args.options);
  }

  public loadAppWindow() {
    global[this._appWindowId]?.loadFile(this._rendererLocation.staticFilePath);
  }

  public loadDevAppWindow() {
    global[this._appWindowId]?.loadURL(this._rendererLocation.devServerUrl);
  }

  public openDevTools() {
    /**
     * This opens the devtool in the application window but it emits some warnings below:
     * ```
     * @ts-template/desktop-main:dev: [14052:0305/173019.550077:ERROR:CONSOLE(1)] "Request Autofill.enable failed. {"code":-32601,"message":"'Autofill.enable' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
     * @ts-template/desktop-main:dev: [14052:0305/173019.550098:ERROR:CONSOLE(1)] "Request Autofill.setAddresses failed. {"code":-32601,"message":"'Autofill.setAddresses' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
     * ```
     * 
     * As a workaround, you can comment out this line but the warnings have no impact on the application.
     */
    // https://github.com/electron/electron/issues/41614
    global[this._appWindowId]?.webContents.openDevTools();
  }

  public onClose(callback: (evt: { preventDefault: () => void; readonly defaultPrevented: boolean }) => void) {
    global[this._appWindowId]?.on("close", callback);
    return this;
  }

  public getGlobalInstance() {
    return global[this._appWindowId];
  }

  public show() {
    global[this._appWindowId]?.show();
  }

  public hide() {
    global[this._appWindowId]?.hide();
  }

  public minimize() {
    global[this._appWindowId]?.minimize();
  }

  public maximize() {
    global[this._appWindowId]?.maximize();
  }

  public restore() {
    global[this._appWindowId]?.restore();
  }
}
