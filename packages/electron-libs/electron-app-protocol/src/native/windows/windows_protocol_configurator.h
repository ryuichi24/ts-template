#ifndef WINDOWS_PROTOCOL_CONFIGURATOR_H
#define WINDOWS_PROTOCOL_CONFIGURATOR_H

#include "../core/protocol_configurator_base.h"

namespace EAP
{
    class WindowsProtocolConfigurator : public EAP::ProtocolConfiguratorBase
    {
    public:
        WindowsProtocolConfigurator(const std::string appBundlePath, const std::string protocol);
        void configure() const override;
    };
}

#endif /* WINDOWS_PROTOCOL_CONFIGURATOR_H */