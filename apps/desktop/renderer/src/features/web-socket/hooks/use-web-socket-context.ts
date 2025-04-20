import { useContext } from "react";
import { WebSocketCtx } from "../context/web-socket-ctx";

export const useWebSocketCtx = () => useContext(WebSocketCtx);
