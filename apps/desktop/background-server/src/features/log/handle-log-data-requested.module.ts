import { AppContext, OnWSServerDidReceiveEvent, OnWSServerDidReceiveEventEvent } from "../../utils/lifecycle-events.js";
import { logRepository } from "../log-utils/repositories/log.repository.js";

export class HandleLogDataRequestedModule implements OnWSServerDidReceiveEvent {
  event: string = "on-log-data-requested";

  async onWSServerDidReceiveEvent(evt: OnWSServerDidReceiveEventEvent, appCtx: AppContext): Promise<void> {
    const logs = await logRepository.get({});
    console.log("logs", logs);
  }
}
