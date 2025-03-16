import React, { useEffect, useState } from "react";

export namespace App {
    export type Props = {};
}

export const App: React.FC<App.Props> = (props) => {
    const { } = props;
    const [appVersion, setAppVersion] = useState<string>()
    const [appVersionAutoUpdater, setAppVersionAutoUpdater] = useState<string>()
    const [prereleases, setPrereleases] = useState<string[]>([])
    const [updaterChannel, setUpdaterChannel] = useState<string>()
    const [customChannel, setCustomChannel] = useState<string>()

    const handleUpdaterChannelChange = async (channel: string) => {
        await window.IPC.onUpdaterChannelChanged(channel)
        setUpdaterChannel(channel)
    }


    useEffect(() => {
        window.IPC.onAppVersionRequested().then(({ appVersion, appVersionFromAutoUpdater }) => {
            setAppVersion(appVersion)
            setAppVersionAutoUpdater(appVersionFromAutoUpdater.version)
            setPrereleases(appVersionFromAutoUpdater.prerelease)
        })

        window.IPC.onUpdaterChannelRequested().then(({ channel }) => {
            setUpdaterChannel(channel)
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
        <div>Updater channel: {updaterChannel}</div>
        <div>
            <button onClick={() => handleUpdaterChannelChange("latest")}>Change to latest</button>
            <button onClick={() => handleUpdaterChannelChange("beta")}>Change to beta</button>
            <button onClick={() => handleUpdaterChannelChange("alpha")}>Change to alpha</button>
            {/* custom channel */}
            <input type="text" placeholder="Enter custom channel" onChange={(evt) => setCustomChannel(evt.target.value)} />
            <button onClick={() => {
                if (!customChannel) return
                handleUpdaterChannelChange(customChannel)
                setCustomChannel("")
            }}>Change to custom</button>
        </div>
    </div>);
}
