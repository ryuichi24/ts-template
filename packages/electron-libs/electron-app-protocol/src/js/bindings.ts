import bindings from "bindings";

const addon = bindings("../../..//build/Release/cpp_addon_example.node");

export interface ProtocolConfigurator {
  configure(): void;
}

export const ProtocolConfigurator: {
  new (appBundlePath: string, protocol: string): ProtocolConfigurator;
} = addon.ProtocolConfigurator;
