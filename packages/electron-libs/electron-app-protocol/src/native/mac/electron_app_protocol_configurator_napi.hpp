#ifndef ELECTRON_APP_PROTOCOL_CONFIGURATOR_NAPI_H
#define ELECTRON_APP_PROTOCOL_CONFIGURATOR_NAPI_H

#include <napi.h>
#include "electron_app_protocol_configurator.hpp"

namespace EAP
{
    class ElectronAppProtocolConfiguratorNapi : public Napi::ObjectWrap<EAP::ElectronAppProtocolConfiguratorNapi>
    {
    public:
        ElectronAppProtocolConfiguratorNapi(const Napi::CallbackInfo &info);
        Napi::Value configure(const Napi::CallbackInfo &info);
        static Napi::Function GetClass(Napi::Env env);

    private:
        const ElectronAppProtocolConfigurator configurator;
    };
}

#endif /* ELECTRON_APP_PROTOCOL_CONFIGURATOR_NAPI_H */