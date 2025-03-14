import path from "path";
import { rebuild } from "@electron/rebuild";
import { readPackageJsonFile, PackageJSON } from "@ts-template/package-json-util"

console.log("************************* Rebuilding the native modules... *************************");
const contentPackageJSON = readPackageJsonFile("package.json")
const packageJSON = new PackageJSON(contentPackageJSON)
const packageJSONObj = packageJSON.toObj()
const submodules = Object.keys(packageJSONObj.dependencies ?? {})

const target = submodules.reduce<{ electronVersion: string | null, subModuleDirs: string[] }>((acc, subModule) => {
    let electronVersion = acc.electronVersion ?? null;
    const subModuleDir = path.resolve("node_modules", subModule)
    // Get the electron version from the desktop-main package.json
    if (electronVersion === null && subModule.includes("desktop-main")) {
        const subModulePackageJson = readPackageJsonFile(path.join(subModuleDir, "package.json"))
        const rawVersion = (subModulePackageJson.devDependencies.electron ?? subModulePackageJson.dependencies.electron);
        if (rawVersion === undefined) {
            throw new Error("Electron version not found!");
        }

        if (rawVersion.includes("^")) {
            electronVersion = rawVersion.split("^")[1]
        }

        if (!rawVersion.includes("^")) {
            electronVersion = rawVersion
        }
    }
    return { ...acc, electronVersion: electronVersion, subModuleDirs: [...acc.subModuleDirs, subModuleDir] }
}, { electronVersion: null, subModuleDirs: [] });

if (target.electronVersion === null) {
    throw new Error("Electron version not found!");
}

console.log(`Electron version: ${target.electronVersion}`);

for (const subModuleDir of target.subModuleDirs) {
    console.log(`Rebuilding the native modules in ${subModuleDir}...`);
    await rebuild({ buildPath: subModuleDir, electronVersion: target.electronVersion, debug: true });
    console.log(`Rebuilding the native modules in ${subModuleDir} done!`);
}

console.log("************************* Rebuilding the native modules done! *************************");
