import { AppContext, OnWSServerDidClose, OnWSServerDidOpen, WSServerModuleEvent } from "../utils/lifecycle-events.js";
import { credentialStore } from "../stores/credential-store.js";
import { apiClient } from "../clients/api-client.js";

export class HandleOauthLoginSuccessRedirectModule implements OnWSServerDidOpen, OnWSServerDidClose {
  private _abortCtrl = new AbortController();

  async onWSServerDidOpen(evt: WSServerModuleEvent, appCtx: AppContext): Promise<void> {
    appCtx.mainProcessEventHandler?.on(
      "on-oauth-login-success-redirect",
      async (payload) => {
        const redirectUrl = payload.redirectUrl;
        const parsedUrl = new URL(redirectUrl);
        const accessToken = parsedUrl.searchParams.get("access_token");
        const refreshToken = parsedUrl.searchParams.get("refresh_token");
        const accessTokenExpiresAt = parsedUrl.searchParams.get("access_token_expires_at");
        const refreshTokenExpiresAt = parsedUrl.searchParams.get("refresh_token_expires_at");

        if (!accessToken || !refreshToken || !accessTokenExpiresAt || !refreshTokenExpiresAt) {
          appCtx.logger.error("Invalid OAuth Login Success URL");
          return;
        }

        await Promise.all([
          credentialStore.set("accessToken.value", accessToken),
          credentialStore.set("accessToken.expiresAt", accessTokenExpiresAt),
          credentialStore.set("refreshToken.value", refreshToken),
          credentialStore.set("refreshToken.expiresAt", refreshTokenExpiresAt),
        ]);

        const res = await apiClient.get("http://localhost:3000/api/auth/me");

        evt.ws.send(
          JSON.stringify({
            event: "on-authenticated",
            payload: {
              userInfo: res.data,
            },
          }),
        );

        appCtx.mainProcessEventHandler?.emit("on-app-window-focus-request", { id: "main" });
      },
      { signal: this._abortCtrl.signal },
    );
  }

  async onWSServerDidClose(evt: WSServerModuleEvent, appCtx: AppContext): Promise<void> {
    this._abortCtrl.abort();
  }
}
