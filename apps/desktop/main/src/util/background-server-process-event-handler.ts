import { ChildProcess } from "child_process";
import { ProcessEventEmitter } from "@ts-template/process-event-emitter";

type MainProcessEvent = any;
type BackgroundServerProcessEvent = any;

export class BackgroundServerProcessEventHandler extends ProcessEventEmitter<
  MainProcessEvent,
  BackgroundServerProcessEvent
> {
  constructor(childProcess?: ChildProcess | null) {
    super(childProcess);
  }
}
