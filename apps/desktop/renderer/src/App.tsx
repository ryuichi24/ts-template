import React, { useEffect, useState } from "react";
import { useAuth, useUserInfo } from "./features/auth";

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

  const { isAuthenticated } = useAuth();
  const { userInfo } = useUserInfo();

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
  }, []);

  const handleUpdateCheckRequested = async () => {
    await window.IPC.onUpdateCheckRequested();
  };

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">App Header</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {userInfo.avatarUrl ? (
            <img src={userInfo.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
          ) : null}
        </div>
      </header>
      <div className="mb-4 text-lg font-semibold">App version: {appVersion}</div>
      <div className="mb-4 text-lg font-semibold">App version (auto updater): {appVersionAutoUpdater}</div>
      <div className="mb-4">
        <ul className="list-disc list-inside">
          {prereleases.map((prerelease, index) => (
            <li key={index}>{prerelease}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4 text-lg font-semibold">Updater channel: {updaterChannel}</div>
      <div className="mb-4 space-x-2">
        <button
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
          onClick={() => handleUpdaterChannelChange("latest")}
        >
          Change to latest
        </button>
        <button
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
          onClick={() => handleUpdaterChannelChange("beta")}
        >
          Change to beta
        </button>
        <button
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
          onClick={() => handleUpdaterChannelChange("alpha")}
        >
          Change to alpha
        </button>
        <input
          type="text"
          placeholder="Enter custom channel"
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded text-gray-200"
          onChange={(evt) => setCustomChannel(evt.target.value)}
        />
        <button
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
          onClick={() => {
            if (!customChannel) return;
            handleUpdaterChannelChange(customChannel);
            setCustomChannel("");
          }}
        >
          Change to custom
        </button>
      </div>
      <div className="mb-4">
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded" onClick={handleUpdateCheckRequested}>
          Check for updates
        </button>
      </div>

      <div className="mb-4">
        {isAuthenticated ? (
          <div>
            <div className="text-lg font-semibold">You are logged in.</div>
            <div>
              <button onClick={() => window.IPC.onLogoutRequested()}>Logout</button>
            </div>
          </div>
        ) : (
          <button
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
            onClick={() => window.IPC.onOpenInBrowserRequested("http://localhost:3000/api/oauth/login/desktop/google")}
          >
            Login with Google
          </button>
        )}
      </div>

      <div>
        {userInfo && (
          <ul className="list-disc list-inside">
            <li>Username: {userInfo.username}</li>
            <li>Email: {userInfo.email}</li>
          </ul>
        )}
      </div>
    </div>
  );
};
