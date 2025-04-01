import ReactDOM from "react-dom/client";
import { App } from "./App";
import { logger } from "./util/logger";
import "./style.css"

logger.info("Starting renderer process");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
