import path from "path";
import { rebuild } from "@electron/rebuild";
import { readPackageJsonFile, PackageJSON, isNativeModule } from "@ts-template/package-json-util"

console.log("************************* Rebuilding the native modules... *************************");
const contentPackageJSON = readPackageJsonFile("package.json")
const packageJSON = new PackageJSON(contentPackageJSON)
const packageJSONObj = packageJSON.toObj()
const submodules = Object.keys(packageJSONObj.dependencies ?? {})

for (const subModule of submodules) {
    const subModuleDir = path.resolve("node_modules", subModule)
    console.log(`Rebuilding the native modules in ${subModuleDir}...`);
    await rebuild({ buildPath: subModuleDir, electronVersion: "34.3.0" });
    console.log(`Rebuilding the native modules in ${subModuleDir} done!`);
}

console.log("************************* Rebuilding the native modules done! *************************");