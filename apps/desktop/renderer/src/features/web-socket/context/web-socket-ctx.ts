import { createContext } from "react";
import { WebSocketChannel } from "../utils/web-socket-channel";

export namespace WebSocketCtx {
  export type State = {
    channels: { id: string; wsChannel: WebSocketChannel }[];
    dispatch: React.Dispatch<ReducerAction>;
  } & ReducerState;

  export type PublicState = Omit<WebSocketCtx.State, "dispatch" | keyof ReducerState>;

  export type ReducerState = {};

  export type ReducerAction = {};
}

export const WebSocketCtx = createContext<WebSocketCtx.State>({
  dispatch: () => {},
  channels: [],
}) as React.Context<WebSocketCtx.State> & { reducer: typeof reducer };

function reducer(state: WebSocketCtx.ReducerState, action: WebSocketCtx.ReducerAction): WebSocketCtx.ReducerState {
  const {} = action;
  switch ({}) {
    default:
      return state;
  }
}

WebSocketCtx.reducer = reducer;
