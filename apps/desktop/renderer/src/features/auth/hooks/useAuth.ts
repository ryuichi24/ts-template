import { useAuthCtx } from "../contexts/auth-context";

export function useAuth() {
  const ctx = useAuthCtx();

  return {
    isAuthenticated: ctx.isAuthenticated,
  };
}
