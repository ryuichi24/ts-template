#include <napi.h>
#include "mac_protocol_configurator_napi.h"

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  Napi::String className = Napi::String::New(env, "ProtocolConfigurator");
  exports.Set(className, EAP::MacProtocolConfiguratorNapi::GetClass(env));
  return exports;
}

NODE_API_MODULE(addon, Init)