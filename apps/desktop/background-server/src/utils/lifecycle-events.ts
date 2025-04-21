import { ILogger } from "@ts-template/logger";
import { MainProcessEventHandler } from "./main-process-event-handler.js";
import { WSContext, WSMessageReceive } from "hono/ws";

export type AppContext = {
  logger: ILogger;
  mainProcessEventHandler?: MainProcessEventHandler;
};

export type ModuleEvent = {};

export type ServerModuleEvent = ModuleEvent & { wsPath: string };

export type InActiveServerModuleEvent = ServerModuleEvent & {};

export type ActiveServerModuleEvent = ServerModuleEvent & {
  port: number;
};

export type WSServerModuleEvent = ActiveServerModuleEvent & {
  evtType: string;
  ws: WSContext<any>;
};

export type WSServerMessageEvent = WSServerModuleEvent & {
  data?: any;
  $event: MessageEvent<WSMessageReceive>;
};

export interface OnServerWillStart {
  onServerWillStart(evt: InActiveServerModuleEvent, appCtx: AppContext): Promise<void>;
}

export interface OnServerDidStart {
  onServerDidStart(evt: ActiveServerModuleEvent, appCtx: AppContext): Promise<void>;
}

export interface OnServerWillClose {
  onServerWillClose(evt: ActiveServerModuleEvent, appCtx: AppContext): Promise<void>;
}

export interface OnServerDidClose {
  onServerDidClose(evt: ActiveServerModuleEvent, appCtx: AppContext): Promise<void>;
}

export interface OnServerThrowsError {
  onServerThrowsError(evt: ModuleEvent, appCtx: AppContext): Promise<void>;
}

export interface OnWSServerDidOpen {
  onWSServerDidOpen(evt: WSServerModuleEvent, appCtx: AppContext): Promise<void>;
}

export interface OnWSServerDidClose {
  onWSServerDidClose(evt: WSServerModuleEvent, appCtx: AppContext): Promise<void>;
}

export interface OnWSServerDidSendMessage {
  onWSServerDidSendMessage(evt: WSServerModuleEvent, appCtx: AppContext): Promise<void>;
}

export interface OnWSServerDidReceiveEvent<evt extends string = string> {
  onWSServerDidReceiveEvent(evt: WSServerMessageEvent, appCtx: AppContext): Promise<void>;
  event: evt;
}

export interface OnWSServerDidReceiveMessage {
  onWSServerDidReceiveMessage(evt: WSServerMessageEvent, appCtx: AppContext): Promise<void>;
}

export type IModule =
  | OnServerWillStart
  | OnServerDidStart
  | OnServerWillClose
  | OnServerDidClose
  | OnServerThrowsError
  | OnWSServerDidSendMessage
  | OnWSServerDidReceiveMessage
  | OnWSServerDidReceiveEvent
  | OnWSServerDidOpen
  | OnWSServerDidClose;

export function hasOnServerWillStart(module: IModule): module is OnServerWillStart {
  return "onServerWillStart" in module;
}

export function hasOnServerDidStart(module: IModule): module is OnServerDidStart {
  return "onServerDidStart" in module;
}

export function hasOnServerWillClose(module: IModule): module is OnServerWillClose {
  return "onServerWillClose" in module;
}

export function hasOnServerDidClose(module: IModule): module is OnServerDidClose {
  return "onServerDidClose" in module;
}

export function hasOnServerThrowsError(module: IModule): module is OnServerThrowsError {
  return "onServerThrowsError" in module;
}

export function hasOnWSServerDidOpen(module: IModule): module is OnWSServerDidOpen {
  return "onWSServerDidOpen" in module;
}

export function hasOnWSServerDidClose(module: IModule): module is OnWSServerDidClose {
  return "onWSServerDidClose" in module;
}

export function hasOnWSServerDidSendMessage(module: IModule): module is OnWSServerDidSendMessage {
  return "onWSServerDidSendMessage" in module;
}

export function hasOnWSServerDidReceiveMessage(module: IModule): module is OnWSServerDidReceiveMessage {
  return "onWSServerDidReceiveMessage" in module;
}

export function hasOnWSServerDidReceiveEvent(module: IModule): module is OnWSServerDidReceiveEvent {
  return "onWSServerDidReceiveEvent" in module && "event" in module;
}

export interface IConstructor<TInstance> {
  new (...args: any[]): TInstance;
}

export interface IModuleConstructor extends IConstructor<IModule> {}
