import { AppContext, OnServerDidStart, OnServerDidStartEvent } from "../utils/lifecycle-events.js";

export class NotifyMainProcessAboutServerStartedModule implements OnServerDidStart {
  async onServerDidStart(evt: OnServerDidStartEvent, appCtx: AppContext): Promise<void> {
    appCtx.mainProcessEventHandler?.emit("bg-server-started", {
      port: evt.port,
    });
  }
}
