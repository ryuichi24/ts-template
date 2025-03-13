import builder from "electron-builder";

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
    electronVersion: "34.3.0",
    publish: [
        {
            provider: "github",
            owner: envs.ELECTRON_GH_RELEASE_REPO_OWNER,
            repo: envs.ELECTRON_GH_RELEASE_REPO_NAME,
            // to use private repository
            private: envs.GH_TOKEN !== undefined,
            channel: envs.ELECTRON_GH_RELEASE_CHANNEL,
        },
    ],
    directories: {
        app: "release/app",
        output: "release/out",
    },
};

builder.build({
    publish: envs.ELECTRON_PUBLISH ? "always" : "never",
    config: builderConfig,
}).catch(err => {
    console.log(err);
})
