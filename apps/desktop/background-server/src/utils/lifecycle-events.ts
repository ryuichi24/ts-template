import { ILogger } from "@ts-template/logger";
import { MainProcessEventHandler } from "./main-process-event-handler.js";
import { WSContext, WSMessageReceive } from "hono/ws";
import { WebSocket } from "ws";
import { CanConstruct } from "@ts-template/type-util";

export type AppContext = {
  logger: ILogger;
  mainProcessEventHandler?: MainProcessEventHandler;
};

export interface CanConstructModule extends CanConstruct<IModule> {}

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

export type ModuleEvent = {};

interface HasWebSocket {
  ws: WSContext<WebSocket>;
}
interface HasMessageEvent {
  $evt: MessageEvent<WSMessageReceive>;
}

interface HasCloseEvent {
  $evt: CloseEvent;
}

// Lifecycle events

export interface OnServerWillStartEvent {}
export interface OnServerDidStartEvent {
  port: number;
}
export interface OnServerWillCloseEvent {}
export interface OnServerDidCloseEvent {}
export interface OnServerThrowsErrorEvent {}
export interface OnWSServerDidOpenEvent extends HasWebSocket {}
export interface OnWSServerDidCloseEvent extends HasWebSocket, HasCloseEvent {}
export interface OnWSServerDidSendMessageEvent {}
export interface OnWSServerDidReceiveEventEvent extends HasWebSocket, HasMessageEvent {
  data: {
    event: string;
    payload: any;
  };
}
export interface OnWSServerDidReceiveMessageEvent extends HasWebSocket, HasMessageEvent {
  message: string;
}

// Lifecycle event handlers

export interface OnServerWillStart {
  onServerWillStart(evt: OnServerWillStartEvent, appCtx: AppContext): Promise<void>;
}

export interface OnServerDidStart {
  onServerDidStart(evt: OnServerDidStartEvent, appCtx: AppContext): Promise<void>;
}

export interface OnServerWillClose {
  onServerWillClose(evt: OnServerWillCloseEvent, appCtx: AppContext): Promise<void>;
}

export interface OnServerDidClose {
  onServerDidClose(evt: OnServerDidCloseEvent, appCtx: AppContext): Promise<void>;
}

export interface OnServerThrowsError {
  onServerThrowsError(evt: OnServerThrowsErrorEvent, appCtx: AppContext): Promise<void>;
}

export interface OnWSServerDidOpen {
  onWSServerDidOpen(evt: OnWSServerDidOpenEvent, appCtx: AppContext): Promise<void>;
}

export interface OnWSServerDidClose {
  onWSServerDidClose(evt: OnWSServerDidCloseEvent, appCtx: AppContext): Promise<void>;
}

export interface OnWSServerDidSendMessage {
  onWSServerDidSendMessage(evt: OnWSServerDidSendMessageEvent, appCtx: AppContext): Promise<void>;
}

export interface OnWSServerDidReceiveEvent<evt extends string = string> {
  onWSServerDidReceiveEvent(evt: OnWSServerDidReceiveEventEvent, appCtx: AppContext): Promise<void>;
  event: evt;
}

export interface OnWSServerDidReceiveMessage {
  onWSServerDidReceiveMessage(evt: OnWSServerDidReceiveMessageEvent, appCtx: AppContext): Promise<void>;
}

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
