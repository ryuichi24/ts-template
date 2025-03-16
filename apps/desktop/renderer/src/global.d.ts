/// <reference types="vite/client" />

export { }

/**
 * Declaration Merging to add API definition to global Window object
 * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
declare global {
  interface Window {
    IPC: {
      onAppVersionRequested: () => Promise<{ appVersion: string, appVersionFromAutoUpdater: { version: string, prerelease: string[] } }>,
      onUpdaterChannelRequested: () => Promise<{ channel: string }>,
      onUpdaterChannelChanged: (channel: string) => Promise<{}>,
    };
  }
}