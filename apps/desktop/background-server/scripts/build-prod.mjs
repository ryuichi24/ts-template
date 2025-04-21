import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/index.js",
  platform: "node",
  format: "esm",
  external: ["better-sqlite3"],
  tsconfig: "./tsconfig.json",
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import _url from "url"; const require = createRequire(import.meta.url); const __filename = _url.fileURLToPath(import.meta.url); const __dirname = _url.fileURLToPath(new URL(".", import.meta.url));',
  },
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV === "debug" ? true : false,
});
