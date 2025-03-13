import React, { use, useEffect, useState } from "react";

export namespace App {
    export type Props = {};
}

export const App: React.FC<App.Props> = (props) => {
    const { } = props;
    const [appVersion, setAppVersion] = useState<string>()
    const [appVersionAutoUpdater, setAppVersionAutoUpdater] = useState<string>()
    const [prereleases, setPrereleases] = useState<string[]>([])
    useEffect(() => {
        window.IPC.appVersionRequested().then(({ appVersion, appVersionFromAutoUpdater }) => {
            setAppVersion(appVersion)
            setAppVersionAutoUpdater(appVersionFromAutoUpdater.version)
            setPrereleases(appVersionFromAutoUpdater.prerelease)
        })
    }, [])
    return (<div>
        <div>App version: {appVersion}</div>
        <div> App version (auto updater): {appVersionAutoUpdater}</div>
        <div>
            <ul>
                {prereleases.map((prerelease, index) => <li key={index}>{prerelease}</li>)}
            </ul>
        </div>
    </div>);
}
