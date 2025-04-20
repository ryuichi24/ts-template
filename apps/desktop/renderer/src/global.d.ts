/// <reference types="vite/client" />

export {};

/**
 * Declaration Merging to add API definition to global Window object
 * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
declare global {
  interface Window {
    EXPOSED: {
      webSocketPort: number;
      IPC: {
        onAppVersionRequested: () => Promise<{
          appVersion: string;
          appVersionFromAutoUpdater: { version: string; prerelease: string[] };
        }>;
        onUpdaterChannelRequested: () => Promise<{ channel: string }>;
        onUpdaterChannelChanged: (channel: string) => Promise<{}>;
        onUpdateCheckRequested: () => Promise<{}>;
        onOpenInBrowserRequested: (url: string) => Promise<{}>;
        onOauthLoginSuccess: (
          callback: (payload: {
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresAt: string;
            refreshTokenExpiresAt: string;
            userInfo: any;
          }) => void,
        ) => void;
        onCheckAuthRequested: () => Promise<any>;
        onLogoutRequested: () => Promise<any>;
        onLogoutSuccess: (callback: () => void) => void;
      };
    };
  }
}
