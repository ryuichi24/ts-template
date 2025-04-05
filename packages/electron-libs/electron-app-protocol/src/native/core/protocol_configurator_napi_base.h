#ifndef PROTOCOL_CONFIGURATOR_NAPI_BASE_H
#define PROTOCOL_CONFIGURATOR_NAPI_BASE_H

#include <string>
#include <napi.h>
#include "protocol_configurator_base.h"
#include "napi_object_base.h"

namespace EAP
{
    template <typename TNapiObject>
    class ProtocolConfiguratorNapiBase : public EAP::NapiObjectBase<TNapiObject>
    {
    public:
        ProtocolConfiguratorNapiBase(const Napi::CallbackInfo &info) : EAP::NapiObjectBase<TNapiObject>(info)
        {
        }

        virtual void configure(const Napi::CallbackInfo &info) = 0;

    protected:
        virtual EAP::ProtocolConfiguratorBase *getConfigurator() = 0;
    };
}

#endif /* PROTOCOL_CONFIGURATOR_NAPI_BASE_H */