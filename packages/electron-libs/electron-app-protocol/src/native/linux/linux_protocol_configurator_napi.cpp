#include "linux_protocol_configurator_napi.h"
#include "../core/protocol_configurator_napi_base.h"
#include "linux_protocol_configurator.h"

EAP::LinuxProtocolConfiguratorNapi::LinuxProtocolConfiguratorNapi(const Napi::CallbackInfo &info)
    : EAP::ProtocolConfiguratorNapiBase<LinuxProtocolConfiguratorNapi>(info),
      pConfigurator(std::make_unique<EAP::LinuxProtocolConfigurator>(getString(info, 0), getString(info, 1)))
{
}

EAP::LinuxProtocolConfigurator *EAP::LinuxProtocolConfiguratorNapi::getConfigurator()
{
    return this->pConfigurator.get();
}

void EAP::LinuxProtocolConfiguratorNapi::configure(const Napi::CallbackInfo &info)
{
    if (info.Length() != 0)
    {
        throw Napi::TypeError::New(info.Env(), "No arguments expected");
    }

    this->getConfigurator()->configure();
}

Napi::Function EAP::LinuxProtocolConfiguratorNapi::GetClass(Napi::Env env)
{
    return DefineClass(env, "ProtocolConfigurator", {EAP::LinuxProtocolConfiguratorNapi::InstanceMethod("configure", &EAP::LinuxProtocolConfiguratorNapi::configure)});
}