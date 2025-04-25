import path from "path"
import { execSync } from "child_process";
import { makeDirIfNotExist, symlinkDirIfNotExist, makeFile, dirExist } from "@ts-template/file-system"
import { readPackageJsonFile, PackageJSON, isNativeModule } from "@ts-template/package-json-util"

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

const appPackageJson = new PackageJSON({
    version: process.env.TST_ELECTRON_RELEASE_VERSION as `${number}.${number}.${number}` ?? "0.0.1",
    name: process.env.TST_ELECTRON_APP_NAME ?? `${projectName.replace("@", "")}-desktop`,
    type: "module",
    main: `dist/${projectName}/desktop-main/index.js`,
});

submodules.forEach(subModule => {
    const subModuleDir = path.resolve("node_modules", subModule)
    const dest = path.resolve(appDistDir, subModule)

    const subModuleDistDir = path.join(subModuleDir, "dist")
    const subModuleBinDir = path.join(subModuleDir, "bin")

    if (dirExist(subModuleDistDir)) {
        symlinkDirIfNotExist(subModuleDistDir, dest)
    }

    if (dirExist(subModuleBinDir)) {
        symlinkDirIfNotExist(subModuleBinDir, dest)
    }

    /**
     * Scan dependencies of each sub module and add native modules to the app package.json if any
     */
    const subModulePackageJson = readPackageJsonFile(path.join(subModuleDir, "package.json"))
    const subModulePackageJsonObj = new PackageJSON(subModulePackageJson).toObj();
    Object.entries(subModulePackageJsonObj.dependencies ?? {}).forEach(([dep, depVersion]) => {
        const depPackageJsonPath = path.join(subModuleDir, "node_modules", dep, "package.json")
        const depPackageJson = readPackageJsonFile(depPackageJsonPath)
        if (isNativeModule(depPackageJson)) {
            appPackageJson.addDependency(dep, depVersion)
        }
    })
})

makeFile(path.join(appDir, "package.json"), { content: appPackageJson.toJson() });

// Install dependencies for some native modules
execSync("pnpm --ignore-workspace install", {
    cwd: appDir,
    stdio: "inherit",
});