import ReactDOM from "react-dom/client";
import { App } from "./App";
import { logger } from "./util/logger";

logger.info("Starting renderer process");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
