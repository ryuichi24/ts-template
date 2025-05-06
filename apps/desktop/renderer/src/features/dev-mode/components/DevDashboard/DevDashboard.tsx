import { useBgServerWebSocket } from "@/hooks/use-bg-server-websocket";
import React from "react";

export namespace DevDashboard {
  export type Props = {};
}

export const DevDashboard: React.FC<DevDashboard.Props> = (props) => {
  const {} = props;
  const ws = useBgServerWebSocket();

  const handleGetLogsClick = () => {
    ws.emit("on-log-data-requested");
  };

  return (
    <div>
      <button onClick={handleGetLogsClick}>Get Logs</button>
    </div>
  );
};
