import { ProcessEventEmitter } from "@ts-template/process-event-emitter";
import { ChildProcess } from "child_process";

type BackgroundServerProcessEvent = any;
type MainProcessEvent = any;

export class MainProcessEventHandler extends ProcessEventEmitter<BackgroundServerProcessEvent, MainProcessEvent> {
  constructor(childProcess?: ChildProcess | null) {
    super(childProcess);
  }
}
