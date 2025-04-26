import { ILogger } from "@ts-template/logger";
import { CanConstruct } from "@ts-template/type-util";

export type AppContext = {
  appName: string;
  appVersion: string;
  appVersionFromAutoUpdater: string;
  isPackaged: boolean;
  assetPath: string;
  osSpecificAssetPath: string;
  userDataPath: string;
  rootDir: string;
  logger: ILogger;
};

export interface CanConstructModule extends CanConstruct<IModule> {}

export type IModule =
  | OnReady
  | OnBootstrap
  | OnQuit
  | OnBeforeQuit
  | OnWindowAllClosed
  | OnActivate
  | OnOpenUrl
  | OnSecondInstance;

interface ModuleEvent {}

interface HasElectronEvent {
  $evt: Electron.Event;
}

export interface OnReadyEvent extends ModuleEvent, HasElectronEvent {}
export interface OnBootstrapEvent extends ModuleEvent, HasElectronEvent {}
export interface OnQuitEvent extends ModuleEvent, HasElectronEvent {
  exitCode: number;
}
export interface OnBeforeQuitEvent extends ModuleEvent, HasElectronEvent {}
export interface OnWindowAllClosedEvent extends ModuleEvent {}
export interface OnActivateEvent extends ModuleEvent, HasElectronEvent {}
export interface OnOpenUrlEvent extends ModuleEvent, HasElectronEvent {
  url: string;
}
export interface OnSecondInstanceEvent extends ModuleEvent, HasElectronEvent {
  argv: string[];
  workingDirectory: string;
  additionalData: unknown;
}

export interface OnReady {
  onReady(evt: OnReadyEvent, appCtx: AppContext): void | Promise<void>;
}

export interface OnBootstrap {
  onBootstrap(evt: OnBootstrapEvent, appCtx: AppContext): void | Promise<void>;
}

export interface OnQuit {
  onQuit(evt: OnQuitEvent, appCtx: AppContext): void | Promise<void>;
}

export interface OnBeforeQuit {
  onBeforeQuit(evt: OnBeforeQuitEvent, appCtx: AppContext): void | Promise<void>;
}

export interface OnWindowAllClosed {
  onWindowAllClosed(evt: OnWindowAllClosedEvent, appCtx: AppContext): void | Promise<void>;
}

export interface OnActivate {
  onActivate(evt: OnActivateEvent, appCtx: AppContext): void | Promise<void>;
}

export interface OnOpenUrl {
  onOpenUrl(evt: OnOpenUrlEvent, appCtx: AppContext): void | Promise<void>;
}

export interface OnSecondInstance {
  onSecondInstance(evt: OnSecondInstanceEvent, appCtx: AppContext): void | Promise<void>;
}

export function hasOnReady(module: IModule): module is OnReady {
  return "onReady" in module;
}

export function hasOnBootstrap(module: IModule): module is OnBootstrap {
  return "onBootstrap" in module;
}

export function hasOnQuit(module: IModule): module is OnQuit {
  return "onQuit" in module;
}

export function hasOnBeforeQuit(module: IModule): module is OnBeforeQuit {
  return "onBeforeQuit" in module;
}

export function hasOnWindowAllClosed(module: IModule): module is OnWindowAllClosed {
  return "onWindowAllClosed" in module;
}

export function hasOnActivate(module: IModule): module is OnActivate {
  return "onActivate" in module;
}

export function hasOnOpenUrl(module: IModule): module is OnOpenUrl {
  return "onOpenUrl" in module;
}

export function hasOnSecondInstance(module: IModule): module is OnSecondInstance {
  return "onSecondInstance" in module;
}
