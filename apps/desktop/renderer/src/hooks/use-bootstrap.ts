import { useEffect } from "react";
import { useBgServerWebSocket } from "./use-bg-server-websocket";

export function useBootstrap() {
  const ws = useBgServerWebSocket();

  useEffect(() => {
    ws.emit("on-renderer-process-ready");
  }, []);
}
