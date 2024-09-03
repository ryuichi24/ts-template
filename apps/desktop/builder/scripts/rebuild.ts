import path from "path";
import { rebuild } from "@electron/rebuild";
import { devDependencies as mainDevDependencies } from "../../main/package.json";
import { dependencies as subModules } from "../package.json";
import { buildESMHelpers } from "@ts-template/esm-helper";

const { require } = buildESMHelpers(import.meta.url);

console.log("rebuilding native modules...");

const subModulesNames = Object.keys(subModules);

for (let index = 0; index < subModulesNames.length; index++) {
  const subModuleName = subModulesNames[index];
  const subModuleFolder = require.resolve(`${subModuleName}/package.json`);
  const split = subModuleFolder.split(path.sep);
  const parsed = split.toSpliced(split.length - 1, 1).join("/");
  await rebuild({ buildPath: parsed, electronVersion: mainDevDependencies.electron.replace("^", "") });
}
console.log("rebuild done!");
