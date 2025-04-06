#include <iostream>
#include "mac_protocol_configurator.h"
// Objective-C headers
#import <Foundation/Foundation.h>

EAP::MacProtocolConfigurator::MacProtocolConfigurator(const std::string appBundlePath, const std::string protocol)
    : EAP::ProtocolConfiguratorBase(appBundlePath, protocol)
{
}

void EAP::MacProtocolConfigurator::configure() const
{
    // Implement the macOS specific protocol configuration logic here
    // For example, you might want to modify the Info.plist file of the app bundle
    // to register the custom protocol.
    // This is just a placeholder implementation.
    std::cout << "Configuring macOS app protocol for: " << this->appBundlePath << " with protocol: " << this->protocol << std::endl;
    const std::string path = this->appBundlePath;
    const std::string protocol = this->protocol;

    // Objective-C code
    @autoreleasepool
    {
    NSString *appProtocol =
      [NSString stringWithCString:protocol.c_str()
                         encoding:[NSString defaultCStringEncoding]];
    NSString *appPath =
      [NSString stringWithCString:path.c_str()
                         encoding:[NSString defaultCStringEncoding]];
    NSURL *inUrl = [NSURL fileURLWithPath:appPath];

    OSStatus registerStatus =
      LSRegisterURL((__bridge CFURLRef _Nonnull)(inUrl), true);

    NSString *bundleID =
      [NSString stringWithFormat:@"com.deeplink.%@", appProtocol];

    OSStatus setDefaultStatus = LSSetDefaultHandlerForURLScheme(
      (__bridge CFStringRef)appProtocol, (__bridge CFStringRef)bundleID);

    NSURL *url =
      [NSURL URLWithString:[NSString stringWithFormat:@"%@://", appProtocol]];

    CFArrayRef urlList =
      LSCopyApplicationURLsForURL((__bridge CFURLRef)url, kLSRolesAll);
    }
}