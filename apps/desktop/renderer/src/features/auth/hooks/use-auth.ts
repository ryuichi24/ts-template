import { useAuthCtx } from "./use-auth-ctx";

export function useAuth() {
  const ctx = useAuthCtx();

  return {
    isAuthenticated: ctx.isAuthenticated,
  };
}
