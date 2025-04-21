import { apiClient } from "../clients/api-client.js";
import { credentialStore } from "../stores/credential-store.js";
import { AppContext, OnWSServerDidReceiveEvent, WSServerMessageEvent } from "../utils/lifecycle-events.js";

export class HandleLogoutRequestModule implements OnWSServerDidReceiveEvent {
  event: string = "on-logout-requested";
  async onWSServerDidReceiveEvent(evt: WSServerMessageEvent, appCtx: AppContext): Promise<void> {
    const refreshToken = credentialStore.get("refreshToken.value");
    await apiClient.post("/auth/logout", {
      refreshToken,
    });

    credentialStore.delete("accessToken");
    credentialStore.delete("refreshToken");

    evt.ws.send(
      JSON.stringify({
        event: "on-logout-success",
      }),
    );
  }
}
