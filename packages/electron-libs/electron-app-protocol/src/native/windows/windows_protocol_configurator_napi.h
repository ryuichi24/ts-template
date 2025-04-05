#ifndef MAC_PROTOCOL_CONFIGURATOR_NAPI_H
#define MAC_PROTOCOL_CONFIGURATOR_NAPI_H

#include "../core/protocol_configurator_napi_base.h"
#include "windows_protocol_configurator.h"

namespace EAP
{
    class WindowsProtocolConfiguratorNapi : public EAP::ProtocolConfiguratorNapiBase<WindowsProtocolConfiguratorNapi>
    {
    public:
        WindowsProtocolConfiguratorNapi(const Napi::CallbackInfo &info);
        void configure(const Napi::CallbackInfo &info) override;
        static Napi::Function GetClass(Napi::Env env);

    protected:
        const std::unique_ptr<EAP::WindowsProtocolConfigurator> pConfigurator;
        EAP::WindowsProtocolConfigurator *getConfigurator() override;
    };
}

#endif /* MAC_PROTOCOL_CONFIGURATOR_NAPI_H */ 