import Electron from 'electron';

export class TrayManager {
  // https://qiita.com/hibara/items/4a3c26817e5449ebf722
  // https://www.electronjs.org/docs/latest/faq#my-apps-tray-disappeared-after-a-few-minutes
  private static _tray: Electron.Tray | null = null;

  public static createTray(trayIconPath: string) {
    this._tray = new Electron.Tray(trayIconPath);
  }

  public static getTray() {
    return this._tray;
  }
}
