import React, { useReducer } from "react";
import { WebSocketCtx } from "../../context/web-socket-ctx";
import { WebSocketChannel } from "../../utils/web-socket-channel";

export namespace WebSocketProvider {
  export type Props = {
    children: React.ReactNode;
    channels: { id: string; wsChannel: WebSocketChannel }[];
  };
}

export const WebSocketProvider: React.FC<WebSocketProvider.Props> = (props) => {
  const { channels, children } = props;

  const [state, dispatch] = useReducer(WebSocketCtx.reducer, {});

  return <WebSocketCtx.Provider value={{ ...state, channels, dispatch }}>{children}</WebSocketCtx.Provider>;
};
