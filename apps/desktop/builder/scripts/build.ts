import path from "path"
import builder from "electron-builder";
import { NodeJSCtx } from "@ts-template/node-js-ctx"
import { readPackageJsonFile } from "@ts-template/package-json-util"

const envs = {
    COMPANY_DOMAIN: process.env.TST_COMPANY_DOMAIN ?? "example.com",
    ELECTRON_APP_NAME: process.env.TST_ELECTRON_APP_NAME,
    ELECTRON_GH_RELEASE_REPO_OWNER: process.env.TST_ELECTRON_GH_RELEASE_REPO_OWNER,
    ELECTRON_GH_RELEASE_REPO_NAME: process.env.TST_ELECTRON_GH_RELEASE_REPO_NAME,
    ELECTRON_GH_RELEASE_CHANNEL: process.env.TST_ELECTRON_GH_RELEASE_CHANNEL,
    ELECTRON_PUBLISH: process.env.TST_ELECTRON_PUBLISH === "1",
    GH_TOKEN: process.env.GH_TOKEN,
    getCompanyName() {
        return envs.COMPANY_DOMAIN.split(".")[0]
    },
    getReversedDomain() {
        return this.COMPANY_DOMAIN.split(".").reverse().join(".")
    },
    getAppId() {
        return `${this.getReversedDomain()}.${this.ELECTRON_APP_NAME}`
    },
    getCopyright() {
        return `Copyright © ${new Date().getFullYear()} ${this.getCompanyName()}`
    },
}

const ctx = {
    mainProcessModuleDir: path.join(process.cwd(), "node_modules", "@ts-template", "desktop-main"),
    getOSAssetsDir(os: "mac" | "linux" | "windows") {
        return path.join(this.mainProcessModuleDir, "dist", "assets", os)
    },
    getOSLogoFileExt(os: "mac" | "linux" | "windows") {
        return os === "windows" ? "ico" : os === "mac" ? "icns" : os === "linux" ? "png" : "png"
    },
    getOSLogo(os: "mac" | "linux" | "windows") {
        return path.join(this.getOSAssetsDir(os), "icons", "app", `logo.${this.getOSLogoFileExt(os)}`)
    },
    getElectronVersion() {
        let electronVersion: string | null = null;
        const mainProcessModulePackageJson = readPackageJsonFile(path.join(this.mainProcessModuleDir, "package.json"))
        const rawVersion = (mainProcessModulePackageJson.devDependencies.electron ?? mainProcessModulePackageJson.dependencies.electron);
        if (rawVersion === undefined) {
            throw new Error("Electron version not found!");
        }

        if (rawVersion.includes("^")) {
            electronVersion = rawVersion.split("^")[1]
        }

        if (!rawVersion.includes("^")) {
            electronVersion = rawVersion
        }
        return electronVersion
    }
}

let builderConfig: builder.Configuration = {
    appId: envs.getAppId(),
    productName: envs.ELECTRON_APP_NAME,
    copyright: envs.getCopyright(),
    asar: true,
    asarUnpack: [
        "**\\*.{node,dll}",
    ],
    npmRebuild: true,
    files: ["dist", "node_modules", "package.json"],
    electronVersion: ctx.getElectronVersion(),
    publish: [
        {
            provider: "github",
            owner: envs.ELECTRON_GH_RELEASE_REPO_OWNER,
            repo: envs.ELECTRON_GH_RELEASE_REPO_NAME,
            // to use private repository
            private: envs.GH_TOKEN !== undefined,
            channel: envs.ELECTRON_GH_RELEASE_CHANNEL,
            token: envs.GH_TOKEN,
        },
    ],
    directories: {
        app: "release/app",
        output: "release/out",
    },
    extraFiles: [],
};

const macConfig: builder.Configuration["mac"] = {
    target: {
        arch: ["arm64", "x64"],
        target: "default",
    },
    icon: ctx.getOSLogo("mac")
}

const linuxConfig: builder.Configuration["linux"] = {
    target: ["AppImage"],
    icon: ctx.getOSLogo("linux"),
}

const windowsConfig: builder.Configuration["win"] = {
    target: ["nsis"],
    icon: ctx.getOSLogo("windows"),
}

if (NodeJSCtx.isMac) {
    builderConfig = {
        ...builderConfig, mac: macConfig,
        // https://github.com/MichaelTr7/Electron-Builder-DMG-Tutorial
        dmg: {
            window: {
                width: 544,
                height: 408,
            },
            contents: [
                {
                    x: 130,
                    y: 220,
                },
                {
                    x: 410,
                    y: 220,
                    type: "link",
                    path: "/Applications",
                },
            ],
        },
    }
}

if (NodeJSCtx.isLinux) {
    builderConfig = { ...builderConfig, linux: linuxConfig }
}

if (NodeJSCtx.isWindows) {
    builderConfig = {
        ...builderConfig, win: windowsConfig, nsis: {
            oneClick: true,
            installerHeaderIcon: ctx.getOSLogo("windows"),
            uninstallerIcon: ctx.getOSLogo("windows"),
            uninstallDisplayName: `${envs.ELECTRON_APP_NAME} Uninstaller`,
            allowToChangeInstallationDirectory: false,
            deleteAppDataOnUninstall: true,
        },
    }
}

builder.build({
    publish: envs.ELECTRON_PUBLISH ? "always" : "never",
    config: builderConfig,
}).catch(err => {
    console.log(err);
})
