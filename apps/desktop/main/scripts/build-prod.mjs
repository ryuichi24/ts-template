import * as esbuild from "esbuild";

const appName = process.env.TST_RELEASE_APP_NAME ? `"${process.env.TST_RELEASE_APP_NAME}"` : `"TSTemplate"`

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/index.js",
  platform: "node",
  format: "esm",
  external: ["electron"],
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
  sourcemap: process.env.NODE_ENV === "debug" ? true : false,
  minify: process.env.NODE_ENV === "production",
  define: {
    TST_RELEASE_APP_NAME: appName,
  }
});

await esbuild.build({
  entryPoints: ["src/preload.ts"],
  bundle: true,
  outfile: "dist/preload.mjs",
  platform: "node",
  format: "esm",
  external: ["electron"],
  banner: {
    // for common js imported from third-party libs
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
  minify: process.env.node_env === "production",
});
