#include <napi.h>
#include "electron_app_protocol_configurator_napi.hpp"

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  Napi::String className = Napi::String::New(env, "ElectronAppProtocolConfigurator");
  exports.Set(className, EAP::ElectronAppProtocolConfiguratorNapi::GetClass(env));
  return exports;
}

NODE_API_MODULE(addon, Init)