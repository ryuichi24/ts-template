import ReactDOM from "react-dom/client";
import { App } from "./App";
import { logger } from "./util/logger";
import { AuthProvider } from "./features/auth";
import { WebSocketProvider } from "./features/web-socket";
import "./style.css";

logger.info("Starting renderer process");

const bgServerPort = window.EXPOSED.webSocketPort ?? 8080;
const bgServerWSUrl = `ws://localhost:${bgServerPort}/ws`;
const bgServerWebSocketConnection = new WebSocket(bgServerWSUrl);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AuthProvider>
    <WebSocketProvider channels={[{ id: bgServerWSUrl, ws: bgServerWebSocketConnection }]}>
      <App />
    </WebSocketProvider>
  </AuthProvider>,
);
