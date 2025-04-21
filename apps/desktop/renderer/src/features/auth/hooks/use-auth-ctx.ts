import { useContext } from "react";
import { AuthCtx } from "../contexts/auth-context";

export const useAuthCtx = () => useContext(AuthCtx);
