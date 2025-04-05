#include "mac_protocol_configurator_napi.h"
#include "../core/protocol_configurator_napi_base.h"
#include "mac_protocol_configurator.h"

EAP::MacProtocolConfiguratorNapi::MacProtocolConfiguratorNapi(const Napi::CallbackInfo &info)
    : EAP::ProtocolConfiguratorNapiBase<MacProtocolConfiguratorNapi>(info),
      pConfigurator(std::make_unique<EAP::MacProtocolConfigurator>(getString(info, 0), getString(info, 1)))
{
}

EAP::MacProtocolConfigurator *EAP::MacProtocolConfiguratorNapi::getConfigurator()
{
    return this->pConfigurator.get();
}

void EAP::MacProtocolConfiguratorNapi::configure(const Napi::CallbackInfo &info)
{
    if (info.Length() != 0)
    {
        throw Napi::TypeError::New(info.Env(), "No arguments expected");
    }

    this->getConfigurator()->configure();
}

Napi::Function EAP::MacProtocolConfiguratorNapi::GetClass(Napi::Env env)
{
    return DefineClass(env, "ProtocolConfigurator", {EAP::MacProtocolConfiguratorNapi::InstanceMethod("configure", &EAP::MacProtocolConfiguratorNapi::configure)});
}