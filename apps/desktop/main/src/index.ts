import fs from "fs";
import path from "path";
import { fork } from "child_process";
import { app, ipcMain } from "electron";
import { Application } from "./util/Application.js";
import { AppTray } from "./util/AppTray.js";
import { AppWindow } from "./util/AppWindow.js";
import electronUpdaterPkg from "electron-updater";
const { autoUpdater } = electronUpdaterPkg;

if (require("electron-squirrel-startup")) app.quit();

/**
 * Initialize custom global variables
 */
global.mainWindow = null;
global.tray = null;
global.systemQuitState = "NOT_PENDING";

async function main() {
    const ASSETS_PATH = app.isPackaged
        ? path.join(__dirname, "..", "desktop-main", "assets")
        : path.join("dist", "assets");

    const _app = new Application({
        appName: process.env.TST_RELEASE_APP_NAME ?? "ts-template",
        assetDirBasePath: ASSETS_PATH,
    });

    await _app.waitForReady();

    // bg server start
    const serverFilePath =
        _app.isInDebugMode() || _app.isInDevMode()
            ? require.resolve("@ts-template/desktop-background-server/dist/index.js")
            : path.resolve(__dirname, "..", "desktop-background-server", "index.js");
    const childProcess = fork(serverFilePath, [], {
        env: {
            FORK: "1",
            ELECTRON_USER_DATA_PATH: app.getPath("userData"),
            ELECTRON_USER_RESOURCES_PATH: process.resourcesPath,
            ELECTRON_APP_CONTENTS_PATH: path.resolve(process.resourcesPath, ".."),
            NODE_ENV: process.env.NODE_ENV,
            PATH: process.env.PATH,
        },
        stdio: "inherit",
    });

    /**
     * Check if the app is already running or not and quit if it is
     */
    let isSingleInstance = app.requestSingleInstanceLock();
    if (!isSingleInstance) {
        global.systemQuitState = "APPROVED";
        app.quit();
        return;
    }

    // register IPC event handlers
    ipcMain.handle("IPC:app-version-requested", async () => {
        const appVersion = app.getVersion();
        const appVersionFromAutoUpdater = autoUpdater.currentVersion
        return { appVersion, appVersionFromAutoUpdater }
    })

    // NOTE: while the main module type is ESM but `require` can be used since esbuild adds a script making a custom `require`
    const rendererFilePath = _app.isInDebugMode()
        ? require.resolve("@ts-template/desktop-renderer/dist/index.html")
        : path.resolve(__dirname, "..", "desktop-renderer", "index.html");

    const rendererDevServerURL = `http://localhost:${process.env.TST_DESKTOP_RENDERER_DEV_SERVER_PORT || 5555}`;
    const preloadScriptPath = path.resolve(__dirname, "preload.mjs");

    const mainWindow = new AppWindow({
        appWindowId: "mainWindow",
        options: {
            minWidth: 1408,
            minHeight: 848,
            width: 1408,
            height: 848 + (_app.isInDevMode() ? 630 : 0),
            icon: _app.logoIconPath,
            resizable: _app.isInDevMode(),
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                // https://developer.mamezou-tech.com/blogs/2022/08/03/electron-renderer-process-sandboxed/
                sandbox: false,
                preload: preloadScriptPath,
                additionalArguments: [],
                devTools: _app.isInDevMode() || _app.isInDebugMode(),
            },
        },
        rendererLocation: {
            devServerUrl: rendererDevServerURL,
            staticFilePath: rendererFilePath,
        },
    }).onClose((evt) => {

    });

    _app.addAppWindow("mainWindow", mainWindow);
    _app.launchedAppWindow("mainWindow");
    _app.attachAutoUpdaterToAppWindow("mainWindow");

    const appTray = new AppTray({
        tryIconPath: _app.trayIconPath,
    })
        .setContextMenu([
            {
                label: "Open",
                click: function () {
                    _app.openAppWindow("mainWindow");
                    if (_app.isMac) {
                        _app.showDock();
                    }
                },
            },
            {
                label: "Restart",
                click: function () {
                    _app.restart();
                },
            },
            {
                label: "Quit",
                click: function () {
                    _app.quit();
                },
            },
        ])
        .setToolTip(_app.appName)
        .disableDoubleClick();

    _app.onNativeThemeChange(({ newTrayIconPath }) => {
        appTray.updateTrayIcon(newTrayIconPath);
    });

    // register handlers to app events
    _app
        .onBeforeQuit(() => {

        })
        .onQuit(() => {
            // App is quitted
        });
}

main()