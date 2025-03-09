import builder from "electron-builder";

let builderConfig: builder.Configuration = {
    appId: "com.test.ts-template",
    productName: "TSTemplate",
    copyright: "Copyright © 2025 ryu24",
    asar: true,
    asarUnpack: [
        "**\\*.{node,dll}",
    ],
    npmRebuild: false,
    files: ["dist", "node_modules", "package.json"],
    electronVersion: "34.3.0",
    // publish: [
    //     {
    //         provider: "github",
    //         owner: "",
    //         repo: "",
    //         // to use private repository
    //         private: false,
    //         // to publish it to private repsotiry and make it auto updater work as well
    //         token: "",
    //     },
    // ],
    directories: {
        app: "release/app",
        output: "release/out",
    },
};

builder.build({
    publish: "never",
    config: builderConfig,
}).catch(err => {
    console.log(err);
})