import path from "path"
import { makeDirIfNotExist, symlinkDirIfNotExist, makeFile } from "@ts-template/file-system"

import fs from "fs";

export namespace PackageJSON {
    export type Props = {
        name: string;
        version: `${number}.${number}.${number}`;
        description: string;
        scripts: Record<string, string>;
        private: boolean;
        author: string;
        license: "MIT";
        type: "module" | "commonjs";
        main: string;
        exports: Record<
            "." | `./${string}`,
            Record<"import" | "require", Record<"types" | "default", string>>
        >;
        dependencies: Record<string, string>;
        devDependencies: Record<string, string>;
        publishMeta: {
            appId: string;
            appName: string;
            copyright: string;
            provider: {
                github: {
                    owner: string;
                    repositoryName: string;
                    private: boolean;
                    token: string;
                };
            };
        };
    };
}

export class PackageJSON {
    private _props: Partial<PackageJSON.Props> = {
        version: "1.0.0",
        description: "",
        license: "MIT",
        private: true,
    };

    constructor(props: Partial<PackageJSON.Props>) {
        this._props = { ...this._props, ...props };
    }

    public get publishMeta() {
        return this._props.publishMeta;
    }

    public addDependency(name: string, version: string) {
        this._props = {
            ...this._props,
            dependencies: { ...this._props.dependencies, [name]: version },
        };
    }

    public toObj(): Partial<PackageJSON.Props> {
        return this._props;
    }

    public toJson(): string {
        const json = JSON.stringify(this.toObj(), null, 2);
        return json;
    }
}

export function readPackageJsonFile(path: string) {
    const raw = fs.readFileSync(path, {
        encoding: "utf8",
    });
    return JSON.parse(raw) as PackageJSON.Props;
}

export function isNativeModule(packageJson: PackageJSON.Props) {
    const NATIVE_BUILD_TOOLS = [
        "bindings",
        "node-addon-api",
        "prebuild",
        "nan",
        "node-pre-gyp",
        "node-gyp-build",
    ];
    if (!packageJson.dependencies && !packageJson.devDependencies) {
        console.log(
            `Cannot validate the package since there is no "dependencies" nor "devDependencies"`
        );
        return false;
    }

    return NATIVE_BUILD_TOOLS.some((tool) => {
        return (
            Reflect.has(packageJson.dependencies ?? {}, tool) ||
            Reflect.has(packageJson.devDependencies ?? {}, tool)
        );
    });
}



const contentPackageJSON = readPackageJsonFile("package.json")
const packageJSON = new PackageJSON(contentPackageJSON)

const packageJSONObj = packageJSON.toObj()
const projectName = packageJSONObj.name?.split("/")[0] ?? ""
const submodules = Object.keys(packageJSONObj.dependencies ?? {})

makeDirIfNotExist("release")

const appDir = path.join("release", "app")
const appDistDir = path.join(appDir, "dist")

makeDirIfNotExist(appDir)
makeDirIfNotExist(appDistDir)

// NOTE: Create a directory for the project
makeDirIfNotExist(path.join(appDistDir, projectName))

submodules.forEach(subModule => {
    const subModuleDistDir = path.resolve("node_modules", subModule, "dist")
    const dest = path.resolve(appDistDir, subModule)
    symlinkDirIfNotExist(subModuleDistDir, dest)
})



const appPackageJson = new PackageJSON({
    name: "ts-template",
    type: "module",
    main: `dist/${projectName}/desktop-main/index.js`,
});

makeFile(path.join(appDir, "package.json"), { content: appPackageJson.toJson() });