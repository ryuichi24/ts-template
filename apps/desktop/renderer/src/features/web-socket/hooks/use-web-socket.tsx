import { useWebSocketCtx } from "./use-web-socket-context";

export function useWebSocket(channelId: string) {
  const { channels, dispatch } = useWebSocketCtx();

  const channel = channels.find((c) => c.id === channelId);

  const emit = (event: string, payload: any) => {
    if (channel?.ws.readyState === WebSocket.OPEN) {
      channel.ws.send(JSON.stringify({ event, payload }));
      return;
    }

    dispatch({
      type: "ON_MESSAGE_QUEUED",
      payload: {
        channelId,
        message: { event, payload },
      },
    });
  };

  const on = (event: string, handler: (evt: any) => void) => {
    dispatch({
      type: "ON_OBSERVER_REGISTERED",
      payload: {
        channelId,
        observer: { event, handler },
      },
    });
  };

  return { emit, on };
}
