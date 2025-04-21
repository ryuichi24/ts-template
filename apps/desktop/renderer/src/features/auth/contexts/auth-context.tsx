import { createContext } from "react";

export namespace AuthCtx {
  export type State = { dispatch: React.Dispatch<ReducerAction> } & ReducerState;

  export type PublicState = Omit<AuthCtx.State, "dispatch" | keyof ReducerState>;

  export type ReducerState = {
    userInfo: any;
    isAuthenticated: boolean;
    roles: string[];
  };

  export type ReducerAction = { type: "ON_AUTHENTICATED"; payload: { userInfo: any } } | { type: "ON_LOGOUT" };
}

export const AuthCtx = createContext<AuthCtx.State>({
  dispatch: () => {},
  userInfo: {},
  isAuthenticated: false,
  roles: [],
}) as React.Context<AuthCtx.State> & {
  reducer: typeof reducer;
};

function reducer(state: AuthCtx.ReducerState, action: AuthCtx.ReducerAction): AuthCtx.ReducerState {
  const { type } = action;

  switch (type) {
    case "ON_AUTHENTICATED": {
      const { payload } = action;
      return {
        ...state,
        isAuthenticated: true,
        userInfo: payload.userInfo,
      };
    }
    case "ON_LOGOUT": {
      return {
        ...state,
        isAuthenticated: false,
        userInfo: {},
        roles: [],
      };
    }
    default: {
      return state;
    }
  }
}

AuthCtx.reducer = reducer;
