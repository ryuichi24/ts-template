import { AppContext, OnWSServerDidReceiveEvent, OnWSServerDidReceiveEventEvent } from "../utils/lifecycle-events.js";

export class HandleOpenInBrowserRequestModule implements OnWSServerDidReceiveEvent {
  public event = "on-open-in-browser-request";

  async onWSServerDidReceiveEvent(evt: OnWSServerDidReceiveEventEvent, appCtx: AppContext): Promise<void> {
    const url = evt.data.payload.url;
    appCtx.mainProcessEventHandler?.emit("on-open-in-browser-requested", { url });
  }
}
