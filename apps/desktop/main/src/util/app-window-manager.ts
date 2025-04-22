import Electron from "electron";

export class AppWindowManager {
  private static _windows: Map<string, Electron.BrowserWindow> = new Map();

  public static createWindow(windowId: string, options: Electron.BrowserWindowConstructorOptions) {
    const window = new Electron.BrowserWindow(options);
    this._windows.set(windowId, window);
  }

  public static getWindowOrThrow(windowId: string): Electron.BrowserWindow {
    if (!this._windows.has(windowId)) {
      throw new Error(`Window with id ${windowId} not found`);
    }
    return this._windows.get(windowId)!;
  }

  public static openWindow(windowId: string) {}
}
