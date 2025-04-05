#include "electron_app_protocol_configurator.hpp"
#include <iostream>

EAP::ElectronAppProtocolConfigurator::ElectronAppProtocolConfigurator(std::string appBundlePath, std::string protocol)
    //  member initializer list
    // https://stackoverflow.com/questions/926752/why-should-i-prefer-to-use-member-initializer-lists
    : appBundlePath(appBundlePath),
      protocol(protocol) {
      };

void EAP::ElectronAppProtocolConfigurator::configure() const
{
    std::cout << "Configuring Electron App Protocol for app bundle: " << this->appBundlePath << std::endl;
    std::cout << "Using protocol: " << this->protocol << std::endl;
};