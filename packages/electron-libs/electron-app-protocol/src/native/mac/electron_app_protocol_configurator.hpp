#ifndef ELECTRON_APP_PROTOCOL_CONFIGURATOR_H
#define ELECTRON_APP_PROTOCOL_CONFIGURATOR_H

#include <string>

namespace EAP
{
    class ElectronAppProtocolConfigurator
    {
    public:
        ElectronAppProtocolConfigurator(std::string appBundlePath, std::string protocol);
        void configure() const;
    private:
        const std::string appBundlePath;
        const std::string protocol;
    };

};

#endif /* ELECTRON_APP_PROTOCOL_CONFIGURATOR_H */