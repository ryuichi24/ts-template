#ifndef NAPI_OBJECT_BASE_H
#define NAPI_OBJECT_BASE_H

#include <napi.h>

namespace EAP
{
    template <typename TNapiObject>
    class NapiObjectBase : public Napi::ObjectWrap<TNapiObject>
    {
    public:
        NapiObjectBase(const Napi::CallbackInfo &info) : Napi::ObjectWrap<TNapiObject>(info) {};
        virtual ~NapiObjectBase() = default;

    protected:
        // util methods
        std::string getString(const Napi::CallbackInfo &info, int index)
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
    };
}

#endif /* NAPI_OBJECT_BASE_H */