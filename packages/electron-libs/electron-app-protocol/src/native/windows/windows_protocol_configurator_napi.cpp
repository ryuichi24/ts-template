#include "windows_protocol_configurator_napi.h"
#include "../core/protocol_configurator_napi_base.h"
#include "windows_protocol_configurator.h"

EAP::WindowsProtocolConfiguratorNapi::WindowsProtocolConfiguratorNapi(const Napi::CallbackInfo &info)
    : EAP::ProtocolConfiguratorNapiBase<WindowsProtocolConfiguratorNapi>(info),
      pConfigurator(std::make_unique<EAP::WindowsProtocolConfigurator>(getString(info, 0), getString(info, 1)))
{
}

EAP::WindowsProtocolConfigurator *EAP::WindowsProtocolConfiguratorNapi::getConfigurator()
{
    return this->pConfigurator.get();
}

void EAP::WindowsProtocolConfiguratorNapi::configure(const Napi::CallbackInfo &info)
{
    if (info.Length() != 0)
    {
        throw Napi::TypeError::New(info.Env(), "No arguments expected");
    }

    this->getConfigurator()->configure();
}

Napi::Function EAP::WindowsProtocolConfiguratorNapi::GetClass(Napi::Env env)
{
    return DefineClass(env, "ProtocolConfigurator", {EAP::WindowsProtocolConfiguratorNapi::InstanceMethod("configure", &EAP::WindowsProtocolConfiguratorNapi::configure)});
}