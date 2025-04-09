import { createContext, useContext, useEffect, useReducer } from "react";

export namespace AuthCtx {
  export type State = { dispatch: React.Dispatch<ReducerAction> } & ReducerState;

  export type PublicState = Omit<AuthCtx.State, "dispatch" | keyof ReducerState>;

  export type ReducerState = {
    userInfo: any;
    isAuthenticated: boolean;
    roles: string[];
  };

  export type ReducerAction = { type: "ON_AUTHENTICATED"; payload: { userInfo: any } };
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
    default: {
      return state;
    }
  }
}

AuthCtx.reducer = reducer;

export namespace AuthProvider {
  export type Props = {
    children: React.ReactNode;
  };
}

export const AuthProvider: React.FC<AuthProvider.Props> = (props) => {
  const { children } = props;

  const [state, dispatch] = useReducer(AuthCtx.reducer, {
    isAuthenticated: false,
    roles: [],
    userInfo: {},
  });

  useEffect(() => {
    window.IPC.onOauthLoginSuccess((payload) => {
      dispatch({
        type: "ON_AUTHENTICATED",
        payload: {
          userInfo: payload.userInfo,
        },
      });
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    // Check if user is authenticated
    window.IPC.onCheckAuthRequested();
  }, []);

  return <AuthCtx.Provider value={{ dispatch, ...state }}>{children}</AuthCtx.Provider>;
};

export const useAuthCtx = () => useContext(AuthCtx);
