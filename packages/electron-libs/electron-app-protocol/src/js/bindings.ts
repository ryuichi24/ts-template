import bindings from "bindings";

const addon = bindings("../../..//build/Release/cpp_addon_example.node");

export interface ElectronAppProtocolConfigurator {
  configure(): void;
}

export const ElectronAppProtocolConfigurator: {
  new (appBundlePath: string, protocol: string): ElectronAppProtocolConfigurator;
} = addon.ElectronAppProtocolConfigurator;
