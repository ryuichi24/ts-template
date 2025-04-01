import ReactDOM from "react-dom/client";
import { App } from "./App";
import { logger } from "./util/logger";
import "./style.css";
import { AuthProvider } from "./features/auth/contexts/auth-context";

logger.info("Starting renderer process");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
);
