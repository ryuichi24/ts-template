#include <iostream>
#include "linux_protocol_configurator.h"

EAP::LinuxProtocolConfigurator::LinuxProtocolConfigurator(const std::string appBundlePath, const std::string protocol)
    : EAP::ProtocolConfiguratorBase(appBundlePath, protocol)
{
}

void EAP::LinuxProtocolConfigurator::configure() const
{
    // Implement the linux OS specific protocol configuration logic here
    // For example, you might want to modify the Info.plist file of the app bundle
    // to register the custom protocol.
    // This is just a placeholder implementation.
    std::cout << "Configuring linux OS app protocol for: " << this->appBundlePath << " with protocol: " << this->protocol << std::endl;
}