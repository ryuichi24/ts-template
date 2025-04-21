import { ActiveServerModuleEvent, AppContext, OnServerDidStart } from "../utils/lifecycle-events.js";

export class NotifyMainProcessAboutServerStartedModule implements OnServerDidStart {
  async onServerDidStart(evt: ActiveServerModuleEvent, appCtx: AppContext): Promise<void> {
    appCtx.mainProcessEventHandler?.emit("bg-server-started", {
      port: evt.port,
    });
  }
}
