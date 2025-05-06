import React from "react";
import { useAuth, useUserInfo } from "./features/auth";
import { useWebSocket } from "./features/web-socket";
import { config } from "./features/config/config";
import { useBootstrap } from "./hooks/use-bootstrap";
import { DevDashboard } from "./features/dev-mode";

export namespace App {
  export type Props = {};
}

export const App: React.FC<App.Props> = (props) => {
  const {} = props;

  useBootstrap();

  const { isAuthenticated } = useAuth();
  const { userInfo } = useUserInfo();

  const bgServerWSUrl = config.backgroundServer.getWsUrl();
  const ws = useWebSocket(bgServerWSUrl);

  const handleLoginButtonClick = () => {
    ws.emit("on-open-in-browser-request", { url: `${config.oauth.baseUrl}/google` });
  };

  const handleLogoutButtonClick = () => {
    ws.emit("on-logout-requested");
  };

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NayaFlow Login</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {userInfo.avatarUrl ? (
            <img src={userInfo.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
          ) : null}
        </div>
      </header>

      <div className="mb-4">
        {isAuthenticated ? (
          <div>
            <div className="text-lg font-semibold">You are logged in.</div>
            <div>
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded" onClick={handleLogoutButtonClick}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded" onClick={handleLoginButtonClick}>
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

      <div>
        <DevDashboard />
      </div>
    </div>
  );
};
