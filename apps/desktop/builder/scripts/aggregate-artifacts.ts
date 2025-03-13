import path from "path"
import { makeDirIfNotExist, symlinkDirIfNotExist, makeFile, dirExist } from "@ts-template/file-system"
import { readPackageJsonFile, PackageJSON } from "@ts-template/package-json-util"

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
})

const appPackageJson = new PackageJSON({
    name: `${projectName.replace("@", "")}-desktop`,
    type: "module",
    main: `dist/${projectName}/desktop-main/index.js`,
});

makeFile(path.join(appDir, "package.json"), { content: appPackageJson.toJson() });