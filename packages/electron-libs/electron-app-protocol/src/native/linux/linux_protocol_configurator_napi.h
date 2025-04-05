#ifndef LINUX_PROTOCOL_CONFIGURATOR_NAPI_H
#define LINUX_PROTOCOL_CONFIGURATOR_NAPI_H

#include "../core/protocol_configurator_napi_base.h"
#include "linux_protocol_configurator.h"

namespace EAP
{
    class LinuxProtocolConfiguratorNapi : public EAP::ProtocolConfiguratorNapiBase<LinuxProtocolConfiguratorNapi>
    {
    public:
        LinuxProtocolConfiguratorNapi(const Napi::CallbackInfo &info);
        void configure(const Napi::CallbackInfo &info) override;
        static Napi::Function GetClass(Napi::Env env);

    protected:
        const std::unique_ptr<EAP::LinuxProtocolConfigurator> pConfigurator;
        EAP::LinuxProtocolConfigurator *getConfigurator() override;
    };
}

#endif /* LINUX_PROTOCOL_CONFIGURATOR_NAPI_H */ 