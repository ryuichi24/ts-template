import ReactDOM from "react-dom/client";
import { App } from "./App";
import { logger } from "./util/logger";
import { AuthProvider } from "./features/auth";
import { WebSocketProvider } from "./features/web-socket";
import "./style.css";
import { config } from "./features/config/config";
import { WebSocketChannel } from "./features/web-socket/utils/web-socket-channel";

logger.info("Starting renderer process");

const bgServerWSUrl = config.backgroundServer.getWsUrl();
const bgServerWebSocketConnection = new WebSocketChannel(bgServerWSUrl);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <WebSocketProvider channels={[{ id: bgServerWSUrl, wsChannel: bgServerWebSocketConnection }]}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </WebSocketProvider>,
);
