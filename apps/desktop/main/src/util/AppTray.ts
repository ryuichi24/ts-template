import { Menu, Tray } from "electron";

export namespace AppTray {
  export type constructorArgs = {
    tryIconPath: string;
  };
}

export class AppTray {
  constructor(args: AppTray.constructorArgs) {
    global.tray = new Tray(args.tryIconPath);
  }

  public updateTrayIcon(iconPath: string) {
    global.tray?.setImage(iconPath);
  }

  public setContextMenu(menuItem: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[]) {
    global.tray?.setContextMenu(Menu.buildFromTemplate(menuItem));
    return this;
  }

  public setToolTip(toolTip: string) {
    global.tray?.setToolTip(toolTip);
    return this;
  }

  public clear() {
    global.tray?.destroy();
    global.tray = null;
  }

  public disableDoubleClick() {
    /**
     * This enable clicking a tray icon quickly.
     * Electron stops emitting a click event to the system
     * when the tray icon gets clicks more than two times quickly
     */
    global.tray?.setIgnoreDoubleClickEvents(true);
    return this;
  }
}
