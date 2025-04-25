import { config } from "@/features/config/config";
import { useWebSocket } from "@/features/web-socket";

export function useOauthLogin(provider: string) {
  const bgServerWSUrl = config.backgroundServer.getWsUrl();
  const ws = useWebSocket(bgServerWSUrl);

  const continueWithOauth = () => {
    ws.emit("on-open-in-browser-requested", {
      url: `${config.oauth.baseUrl}/${provider}`,
    });
  };

  return { continueWithOauth } as const;
}
