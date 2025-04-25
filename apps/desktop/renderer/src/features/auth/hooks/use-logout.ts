import { config } from "@/features/config/config";
import { useWebSocket } from "@/features/web-socket";

export function useLogout() {
  const bgServerWSUrl = config.backgroundServer.getWsUrl();
  const ws = useWebSocket(bgServerWSUrl);

  const logout = () => {
    ws.emit("on-logout-requested");
  };

  return { logout } as const;
}
