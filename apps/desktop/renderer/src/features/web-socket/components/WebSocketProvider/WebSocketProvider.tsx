import React, { useEffect, useReducer } from "react";
import { WebSocketCtx } from "../../context/web-socket-ctx";

export namespace WebSocketProvider {
  export type Props = {
    children: React.ReactNode;
    channels: { id: string; ws: WebSocket }[];
  };
}

export const WebSocketProvider: React.FC<WebSocketProvider.Props> = (props) => {
  const { channels, children } = props;

  const [state, dispatch] = useReducer(WebSocketCtx.reducer, {
    messageQueues: {},
    observers: {},
  });

  useEffect(() => {
    const ctrl = new AbortController();

    channels.forEach((channel) => {
      const { ws } = channel;

      ws.addEventListener(
        "open",
        (evt) => {
          console.log("WebSocket connection opened");
          state.observers[channel.id]?.forEach((observer) => {
            if (observer.event === "open") {
              observer.handler({ $evt: evt });
            }
          });

          const queuedMessages = state.messageQueues[channel.id] || [];

          if (0 < queuedMessages.length) {
            queuedMessages.forEach((message) => {
              ws.send(JSON.stringify(message));
            });
            dispatch({ type: "ON_MESSAGE_QUEUE_FLASHED", payload: { channelId: channel.id } });
          }
        },
        { signal: ctrl.signal },
      );

      ws.addEventListener(
        "message",
        (evt) => {
          console.log("Message received:", evt.data);
          state.observers[channel.id]?.forEach((observer) => {
            observer.event;
          });
        },
        { signal: ctrl.signal },
      );

      ws.addEventListener(
        "close",
        (evt) => {
          console.log("WebSocket connection closed");
          state.observers[channel.id]?.forEach((observer) => {
            if (observer.event === "close") {
              observer.handler({ $evt: evt });
            }
          });
        },
        { signal: ctrl.signal },
      );

      ws.addEventListener(
        "error",
        (evt) => {
          console.error("WebSocket error:", evt);
          state.observers[channel.id]?.forEach((observer) => {
            if (observer.event === "error") {
              observer.handler({ $evt: evt });
            }
          });
        },
        { signal: ctrl.signal },
      );
    });

    return () => {
      ctrl.abort();
    };
  }, [state.observers]);

  return <WebSocketCtx.Provider value={{ ...state, channels, dispatch }}>{children}</WebSocketCtx.Provider>;
};
