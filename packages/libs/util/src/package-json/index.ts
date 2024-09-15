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
    exports: Record<string, Record<string, Record<string, string>>>;
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
    bin?: Record<string, string>;
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

  public addScript(name: string, command: string) {
    if (!this._props.scripts) {
      this._props.scripts = {};
    }
    this._props.scripts[name] = command;
  }

  public addDependency(name: string, version: string) {
    this._props = {
      ...this._props,
      dependencies: { ...this._props.dependencies, [name]: version },
    };
  }

  public addDevDependency(name: string, version: string) {
    this._props = {
      ...this._props,
      devDependencies: { ...this._props.devDependencies, [name]: version },
    };
  }

  public addMain(mainJsPath: string) {
    this._props.main = mainJsPath;
  }

  public addExport(exports: {
    path: string;
    moduleImportKey: "import" | "require";
    typesPath: string;
    defaultPath: string;
  }) {
    if (!this._props.exports) {
      this._props.exports = {};
    }
    if (!Object.hasOwn(this._props.exports, exports.path)) {
      this._props.exports[exports.path] = {};
    }
    if (!Object.hasOwn(this._props.exports[exports.path], exports.moduleImportKey)) {
      this._props.exports[exports.path][exports.moduleImportKey] = {};
    }
    this._props.exports[exports.path][exports.moduleImportKey]["types"] = exports.typesPath;
    this._props.exports[exports.path][exports.moduleImportKey]["default"] = exports.defaultPath;
  }

  public addBin(command: string, binPath: string) {
    if (!this._props.bin) {
      this._props.bin = {};
    }
    this._props.bin[command] = binPath;
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
  const NATIVE_BUILD_TOOLS = ["bindings", "node-addon-api", "prebuild", "nan", "node-pre-gyp", "node-gyp-build"];
  if (!packageJson.dependencies && !packageJson.devDependencies) {
    console.log(`Cannot validate the package since there is no "dependencies" nor "devDependencies"`);
    return false;
  }

  return NATIVE_BUILD_TOOLS.some((tool) => {
    return Reflect.has(packageJson.dependencies ?? {}, tool) || Reflect.has(packageJson.devDependencies ?? {}, tool);
  });
}
