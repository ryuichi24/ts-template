import esbuild from "esbuild";
import path from "path";
import { cpDirIfNotExist, cpFileIfNotExist, removeDirIfExist } from "@ts-template/file-system";

removeDirIfExist("release");

await esbuild.build({
  entryPoints: ["src/worker.ts", "src/popup/index.ts"],
  bundle: true,
  outdir: "release",
  format: "iife",
  minify: true,
  sourcemap: false,
  target: ["chrome99"],
  tsconfig: "./tsconfig.json",
});

const popupHtmlPath = path.resolve("src", "popup", "index.html");
const manifestPath = path.resolve("src", "manifest.json");
const assetsPath = path.resolve("src", "assets");

cpFileIfNotExist(popupHtmlPath, path.resolve("release", "popup", "index.html"));
cpFileIfNotExist(manifestPath, path.resolve("release", "manifest.json"));
cpDirIfNotExist(assetsPath, path.resolve("release", "assets"));
