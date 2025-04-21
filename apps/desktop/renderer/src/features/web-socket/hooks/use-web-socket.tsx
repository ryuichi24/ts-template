import { useWebSocketCtx } from "./use-web-socket-context";

export function useWebSocket(channelId: string) {
  const { channels } = useWebSocketCtx();

  const channel = channels.find((c) => c.id === channelId);

  const emit = (event: string, payload: any = {}) => {
    channel?.wsChannel.emit(event, payload);
  };

  const on = (event: string, handler: (evt: any) => void) => {
    channel?.wsChannel.on(event, handler);
  };

  return { emit, on };
}
