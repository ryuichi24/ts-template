import { createContext } from "react";

export namespace WebSocketCtx {
  export type State = {
    channels: { id: string; ws: WebSocket }[];
    dispatch: React.Dispatch<ReducerAction>;
  } & ReducerState;

  export type PublicState = Omit<WebSocketCtx.State, "dispatch" | keyof ReducerState>;

  export type ReducerState = {
    messageQueues: {
      [channelId: string]: {
        event: string;
        payload: any;
      }[];
    };
    observers: {
      [channelId: string]: {
        event: string;
        handler: (evt: any) => void;
      }[];
    };
  };

  export type ReducerAction =
    | {
        type: "ON_MESSAGE_QUEUED";
        payload: {
          channelId: string;
          message: {
            event: string;
            payload: any;
          };
        };
      }
    | {
        type: "ON_OBSERVER_REGISTERED";
        payload: { channelId: string; observer: { event: string; handler: (evt: any) => void } };
      }
    | { type: "ON_MESSAGE_QUEUE_FLASHED"; payload: { channelId: string } };
}

export const WebSocketCtx = createContext<WebSocketCtx.State>({
  dispatch: () => {},
  channels: [],
  messageQueues: {},
  observers: {},
}) as React.Context<WebSocketCtx.State> & { reducer: typeof reducer };

function reducer(state: WebSocketCtx.ReducerState, action: WebSocketCtx.ReducerAction): WebSocketCtx.ReducerState {
  const { type } = action;

  switch (type) {
    case "ON_MESSAGE_QUEUED": {
      console.log("ON_MESSAGE_QUEUED", action.payload);
      const { message } = action.payload;
      return {
        ...state,
        messageQueues: {
          ...state.messageQueues,
          [action.payload.channelId]: [...(state.messageQueues[action.payload.channelId] || []), message],
        },
      };
    }

    case "ON_MESSAGE_QUEUE_FLASHED": {
      const { channelId } = action.payload;
      return {
        ...state,
        messageQueues: {
          ...state.messageQueues,
          [channelId]: [],
        },
      };
    }

    case "ON_OBSERVER_REGISTERED": {
      const { observer } = action.payload;
      return {
        ...state,
        observers: {
          ...state.observers,
          [action.payload.channelId]: [
            ...(state.observers[action.payload.channelId] || []),
            { event: observer.event, handler: observer.handler },
          ],
        },
      };
    }

    default: {
      return state;
    }
  }
}

WebSocketCtx.reducer = reducer;
