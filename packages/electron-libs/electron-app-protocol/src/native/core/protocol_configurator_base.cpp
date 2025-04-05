#include "protocol_configurator_base.h"

EAP::ProtocolConfiguratorBase::ProtocolConfiguratorBase(const std::string appBundlePath, const std::string protocol)
    : appBundlePath(appBundlePath), protocol(protocol)
{
}