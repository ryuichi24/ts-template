#ifndef PROTOCOL_CONFIGURATOR_BASE_H
#define PROTOCOL_CONFIGURATOR_BASE_H

#include <string>

namespace EAP
{
    class ProtocolConfiguratorBase
    {
    public:
        ProtocolConfiguratorBase(const std::string appBundlePath, const std::string protocol);
        virtual ~ProtocolConfiguratorBase() = default;
        virtual void configure() const = 0;

    protected:
        const std::string appBundlePath;
        const std::string protocol;
    };
}

#endif /* PROTOCOL_CONFIGURATOR_BASE_H */