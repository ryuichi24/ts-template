import React, { useEffect, useState } from "react";

export namespace App {
    export type Props = {};
}

export const App: React.FC<App.Props> = (props) => {
    const { } = props;
    const [appVersion, setAppVersion] = useState<string>()
    const [appVersionFromAutoUpdater, setAppVersionAutoUpdater] = useState<string>()
    useEffect(() => {
        window.IPC.appVersionRequested().then(({ appVersion, appVersionFromAutoUpdater }) => {
            setAppVersion(appVersion)
            setAppVersionAutoUpdater(appVersionFromAutoUpdater)
        })
    }, [])
    return (<div>App version: {appVersion} & App version (auto updater): {appVersionFromAutoUpdater} </div>);
}
