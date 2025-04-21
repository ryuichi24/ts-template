import { ChildProcess } from "child_process";
import { EventEmitter } from "events";

namespace ProcessEventEmitter {}
export type EventName = string;

export type Message = {
  event: EventName;
  payload: any;
};

export type EventHandler = (payload: Message["payload"]) => void;

export class ProcessEventEmitter<PublishEvent extends string = string, SubscribeEvent extends string = string> {
  private eventEmitter;
  private _process: ChildProcess | NodeJS.Process;
  private _eventMap: Map<SubscribeEvent, EventHandler[]> = new Map();

  constructor(childProcess?: ChildProcess | null) {
    this.eventEmitter = new EventEmitter();
    this._process = childProcess ?? process;
    this.init();
  }

  private init() {
    this._process.on("message", (msg: Message) => this.eventEmitter.emit(msg.event, msg.payload));
  }

  public emit(event: PublishEvent, payload?: Message["payload"]) {
    this._process.send?.({ event, payload });
  }

  public on(event: SubscribeEvent, handler: EventHandler, options: { signal?: AbortSignal } = {}) {
    const handlers = this._eventMap.get(event);
    if (!handlers) {
      this._eventMap.set(event, [handler]);
    }

    if (handlers) {
      handlers.push(handler);
    }

    this.eventEmitter.on(event, handler);

    if (options.signal) {
      options.signal.addEventListener("abort", () => {
        this.off(event, handler);
      });
    }
  }

  public off(event: SubscribeEvent, handler: EventHandler) {
    this.eventEmitter.off(event, handler);
  }

  public offAll() {
    this._eventMap.forEach((handlers, eventName, eventMap) => {
      handlers.forEach((handler) => this.off(eventName, handler));
      eventMap.delete(eventName);
    });
  }

  public close() {
    if (this.isChild()) {
      (this._process as ChildProcess).kill();
      process.exit(0);
    }
  }

  private isChild() {
    // Only child process has "send" method
    return !!this._process.send;
  }
}
