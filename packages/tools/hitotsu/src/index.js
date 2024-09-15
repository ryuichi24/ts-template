#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { program } from "commander";
import { PackageJSON } from "@ts-template/util/package-json";

program
  .command("add <pathToModule>")
  .description("Add a new module to the workspace.")
  .option("-cjs, --commonjs", "Commonjs flag", false)
  .option("-t, --moduletype <moduletype>", "type of module (app, cli, lib, empty)", "lib")
  .action((pathToModule, options) => {
    const fullPathToNewModule = path.resolve(pathToModule);

    // make a new module directory recursively
    if (!fs.existsSync(fullPathToNewModule)) {
      fs.mkdirSync(fullPathToNewModule, { recursive: true });
    }

    const newModuleName = path.basename(fullPathToNewModule);

    // get root package.json
    const rootPackageJsonPath = path.resolve("package.json");
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, "utf8"));
    const rootProjectName = rootPackageJson.name;

    const fullNewModuleName = `@${rootProjectName}/${newModuleName}`;

    // make package.json file
    const packageJson = new PackageJSON({
      name: fullNewModuleName,
      author: rootPackageJson.author,
      type: options.commonjs ? "commonjs" : "module",
      private: true,
    });

    if (options.moduletype === "app") {
      packageJson.addScript("start", "");
      packageJson.addScript("dev", "");
      packageJson.addScript("build", "");

      packageJson.addMain("./dist/index.js");

      packageJson.addDevDependency("typescript", "^5.4.5");

      const tsconfig = JSON.stringify(
        {
          extends: "@ts-template/tsconfig/node",
          compilerOptions: {
            outDir: "dist",
          },
          include: ["src"],
        },
        null,
        2,
      );
      const tsconfigPath = path.join(fullPathToNewModule, "tsconfig.json");
      fs.writeFileSync(tsconfigPath, tsconfig, "utf8");
    }

    if (options.moduletype === "cli") {
      packageJson.addBin("cli", "dist/index.js");
      packageJson.addDependency("commander", "^12.1.0");
      packageJson.addDevDependency("@ts-template/tsconfig", "workspace:*");
      packageJson.addDevDependency("@types/node", "^20.11.20");
      packageJson.addDevDependency("typescript", "^5.4.5");
      packageJson.addScript("build", "tsc -p tsconfig.json");
      packageJson.addScript("postinstall", "pnpm build");
      const tsconfig = JSON.stringify(
        {
          extends: "@ts-template/tsconfig/node",
          compilerOptions: {
            outDir: "dist",
          },
          include: ["src"],
        },
        null,
        2,
      );
      const tsconfigPath = path.join(fullPathToNewModule, "tsconfig.json");
      fs.writeFileSync(tsconfigPath, tsconfig, "utf8");
    }

    if (options.moduletype === "lib") {
      packageJson.addDevDependency("@ts-template/tsconfig", "workspace:*");
      packageJson.addDevDependency("@ts-template/type-util", "workspace:*");
      packageJson.addDevDependency("@ts-template/tsbuild", "workspace:*");
      //
      packageJson.addDevDependency("@types/node", "^20.11.20");
      packageJson.addDevDependency("typescript", "^5.4.5");

      packageJson.addScript("build", "pnpm build:esm & pnpm build:cjs");
      packageJson.addScript("build:esm", "tsb tsconfig.json -t esm");
      packageJson.addScript("build:cjs", "tsb tsconfig.cjs.json -t cjs");

      packageJson.addMain("./dist/cjs/index.js");
      packageJson.addExport({
        path: ".",
        moduleImportKey: "import",
        typesPath: "./dist/esm/index.d.ts",
        defaultPath: "./dist/esm/index.js",
      });

      packageJson.addExport({
        path: ".",
        moduleImportKey: "require",
        typesPath: "./dist/cjs/index.d.ts",
        defaultPath: "./dist/cjs/index.js",
      });

      const esmTsconfig = JSON.stringify(
        {
          display: "@ts-template/js-utils ESM",
          extends: "@ts-template/tsconfig/node.lib",
          compilerOptions: {
            outDir: "./dist/esm",
          },
          include: ["src"],
        },
        null,
        2,
      );

      const cjsTsconfig = JSON.stringify(
        {
          display: "ts-template/js-utils CJS",
          extends: "@ts-template/tsconfig/node.lib.cjs",
          compilerOptions: {
            outDir: "./dist/cjs",
          },
          include: ["src"],
        },
        null,
        2,
      );

      const esmTsconfigPath = path.join(fullPathToNewModule, "tsconfig.json");
      fs.writeFileSync(esmTsconfigPath, esmTsconfig, "utf8");

      const cjsTsconfigPath = path.join(fullPathToNewModule, "tsconfig.cjs.json");
      fs.writeFileSync(cjsTsconfigPath, cjsTsconfig, "utf8");
    }

    if (options.moduleType === "empty") {
      //
    }

    const newPackageJsonPath = path.join(fullPathToNewModule, "package.json");
    fs.writeFileSync(newPackageJsonPath, packageJson.toJson(), "utf8");

    // make README file
    const newReadmePath = path.join(fullPathToNewModule, "README.md");
    fs.writeFileSync(newReadmePath, `<h1 align="center">${fullNewModuleName}</h1>`, "utf8");
  });

program.parse(process.argv);
