const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";
const os = isMac ? "mac" : isWindows ? "windows" : "linux";
const isDev =
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "dev" ||
  process.env.NODE_ENV === "DEVELOPMENT" ||
  process.env.NODE_ENV === "DEV";
const isDebug = process.env.NODE_ENV === "debug" || process.env.NODE_ENV === "DEBUG";
const isProd =
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "prod" ||
  process.env.NODE_ENV === "PRODUCTION" ||
  process.env.NODE_ENV === "PROD";

export namespace NodeJSCtx {
  export type OS = typeof os;
}

export const NodeJSCtx = {
  isDev,
  isDebug,
  isProd,
  isMac,
  isWindows,
  isLinux,
  os,
};
