import { apiClient } from "../clients/api-client.js";
import { AppContext, OnWSServerDidReceiveEvent, WSServerMessageEvent } from "../utils/lifecycle-events.js";

export class HandleCheckAuthRequestModule implements OnWSServerDidReceiveEvent {
  event: string = "on-check-auth-requested";
  async onWSServerDidReceiveEvent(evt: WSServerMessageEvent, appCtx: AppContext): Promise<void> {
    const res = await apiClient.get("http://localhost:3000/api/auth/me");

    if (res.status === 401) {
      console.log("failed to authenticate");
    }

    if (res.status === 200) {
      evt.ws.send(
        JSON.stringify({
          event: "on-authenticated",
          payload: {
            userInfo: res.data,
          },
        }),
      );
    }
  }
}
