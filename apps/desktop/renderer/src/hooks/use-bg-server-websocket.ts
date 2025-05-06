import { config } from "@/features/config/config";
import { useWebSocket } from "@/features/web-socket";

const bgServerWSUrl = config.backgroundServer.getWsUrl();

export function useBgServerWebSocket() {
  const ws = useWebSocket(bgServerWSUrl);
  return ws;
}
