#ifndef MAC_PROTOCOL_CONFIGURATOR_NAPI_H
#define MAC_PROTOCOL_CONFIGURATOR_NAPI_H

#include "../core/protocol_configurator_napi_base.h"
#include "mac_protocol_configurator.h"

namespace EAP
{
    class MacProtocolConfiguratorNapi : public EAP::ProtocolConfiguratorNapiBase<MacProtocolConfiguratorNapi>
    {
    public:
        MacProtocolConfiguratorNapi(const Napi::CallbackInfo &info);
        void configure(const Napi::CallbackInfo &info) override;
        static Napi::Function GetClass(Napi::Env env);

    protected:
        const std::unique_ptr<EAP::MacProtocolConfigurator> pConfigurator;
        EAP::MacProtocolConfigurator *getConfigurator() override;
    };
}

#endif /* MAC_PROTOCOL_CONFIGURATOR_NAPI_H */ 