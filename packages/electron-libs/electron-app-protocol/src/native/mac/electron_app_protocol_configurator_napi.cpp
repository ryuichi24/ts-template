#include "electron_app_protocol_configurator_napi.hpp"

std::string getNapiString(const Napi::CallbackInfo &info, int index)
{
    if (info.Length() < 1)
    {
        Napi::TypeError::New(info.Env(), "You need to provide a name").ThrowAsJavaScriptException();
    }

    if (!info[index].IsString())
    {
        Napi::TypeError::New(info.Env(), "You need to provide a string").ThrowAsJavaScriptException();
    }

    Napi::String str = info[index].As<Napi::String>();
    return str.Utf8Value();
};

EAP::ElectronAppProtocolConfiguratorNapi::ElectronAppProtocolConfiguratorNapi(const Napi::CallbackInfo &info) : 
    Napi::ObjectWrap<ElectronAppProtocolConfiguratorNapi>(info),
    configurator(EAP::ElectronAppProtocolConfigurator(getNapiString(info, 0), getNapiString(info, 1))) 
    {};

Napi::Value EAP::ElectronAppProtocolConfiguratorNapi::configure(const Napi::CallbackInfo &info)
{
    this->configurator.configure();
    return Napi::Value();
};

Napi::Function EAP::ElectronAppProtocolConfiguratorNapi::GetClass(Napi::Env env)
{
    return DefineClass(env, "ElectronAppProtocolConfigurator", {EAP::ElectronAppProtocolConfiguratorNapi::InstanceMethod("configure", &EAP::ElectronAppProtocolConfiguratorNapi::configure)});
}
