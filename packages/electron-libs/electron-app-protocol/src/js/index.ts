import { ElectronAppProtocolConfigurator } from "./bindings.js";

const configurator = new ElectronAppProtocolConfigurator("../../TestApp", "app-protocol");
configurator.configure();
