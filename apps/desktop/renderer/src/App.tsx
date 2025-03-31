import React, { useEffect, useState } from "react";

export namespace App {
  export type Props = {};
}

export const App: React.FC<App.Props> = (props) => {
  const {} = props;
  const [appVersion, setAppVersion] = useState<string>();
  const [appVersionAutoUpdater, setAppVersionAutoUpdater] = useState<string>();
  const [prereleases, setPrereleases] = useState<string[]>([]);
  const [updaterChannel, setUpdaterChannel] = useState<string>();
  const [customChannel, setCustomChannel] = useState<string>();
  const [oauthLoginSuccessPayload, setOauthLoginSuccessPayload] = useState<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
  }>();

  const handleUpdaterChannelChange = async (channel: string) => {
    await window.IPC.onUpdaterChannelChanged(channel);
    setUpdaterChannel(channel);
  };

  useEffect(() => {
    window.IPC.onAppVersionRequested().then(({ appVersion, appVersionFromAutoUpdater }) => {
      setAppVersion(appVersion);
      setAppVersionAutoUpdater(appVersionFromAutoUpdater.version);
      setPrereleases(appVersionFromAutoUpdater.prerelease);
    });

    window.IPC.onUpdaterChannelRequested().then(({ channel }) => {
      setUpdaterChannel(channel);
    });

    window.IPC.onOauthLoginSuccess((payload) => {
      console.log("oauth login success", payload);
      setOauthLoginSuccessPayload(payload);
    });
  }, []);

  const handleUpdateCheckRequested = async () => {
    await window.IPC.onUpdateCheckRequested();
  };

  return (
    <div>
      <div>App version: {appVersion}</div>
      <div> App version (auto updater): {appVersionAutoUpdater}</div>
      <div>
        <ul>
          {prereleases.map((prerelease, index) => (
            <li key={index}>{prerelease}</li>
          ))}
        </ul>
      </div>
      <div>Updater channel: {updaterChannel}</div>
      <div>
        <button onClick={() => handleUpdaterChannelChange("latest")}>Change to latest</button>
        <button onClick={() => handleUpdaterChannelChange("beta")}>Change to beta</button>
        <button onClick={() => handleUpdaterChannelChange("alpha")}>Change to alpha</button>
        {/* custom channel */}
        <input type="text" placeholder="Enter custom channel" onChange={(evt) => setCustomChannel(evt.target.value)} />
        <button
          onClick={() => {
            if (!customChannel) return;
            handleUpdaterChannelChange(customChannel);
            setCustomChannel("");
          }}
        >
          Change to custom
        </button>
      </div>
      <div>
        <button onClick={handleUpdateCheckRequested}>Check for updates</button>
      </div>

      <div>
        <div>
          <button
            onClick={() =>
              window.IPC.onOpenInBrowserRequested("http://localhost:3000/api/oauth/login/desktop?provider=google")
            }
          >
            Login with Google
          </button>
        </div>
      </div>

      <div>
        {oauthLoginSuccessPayload && (
          <ul>
            <li>Access Token: {oauthLoginSuccessPayload.accessToken}</li>
            <li>Refresh Token: {oauthLoginSuccessPayload.refreshToken}</li>
            <li>Access Token Expires In: {oauthLoginSuccessPayload.accessTokenExpiresAt}</li>
            <li>Refresh Token Expires in: {oauthLoginSuccessPayload.refreshTokenExpiresAt}</li>
          </ul>
        )}
      </div>
    </div>
  );
};
