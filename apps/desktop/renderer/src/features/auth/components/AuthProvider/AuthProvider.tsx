import { useReducer, useEffect } from "react";
import { AuthCtx } from "../../contexts/auth-context";
import { useWebSocket } from "@/features/web-socket";
import { config } from "@/features/config/config";

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

  const bgServerWSUrl = config.backgroundServer.getWsUrl();
  const ws = useWebSocket(bgServerWSUrl);

  useEffect(() => {
    ws.on("on-authenticated", (evt) => {
      const data = evt.data;
      const payload = data.payload;
      dispatch({
        type: "ON_AUTHENTICATED",
        payload: {
          userInfo: payload.userInfo,
        },
      });
    });

    ws.on("on-logout-success", () => {
      dispatch({
        type: "ON_LOGOUT",
      });
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    ws.emit("on-check-auth-requested");
  }, []);

  return <AuthCtx.Provider value={{ dispatch, ...state }}>{children}</AuthCtx.Provider>;
};
