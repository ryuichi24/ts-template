#ifndef MAC_PROTOCOL_CONFIGURATOR_H
#define MAC_PROTOCOL_CONFIGURATOR_H

#include "../core/protocol_configurator_base.h"

namespace EAP
{
    class MacProtocolConfigurator : public EAP::ProtocolConfiguratorBase
    {
    public:
        MacProtocolConfigurator(const std::string appBundlePath, const std::string protocol);
        void configure() const override;
    };
}

#endif /* MAC_PROTOCOL_CONFIGURATOR_H */