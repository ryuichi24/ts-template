import { useAuthCtx } from "./use-auth-ctx";

export function useUserInfo() {
  const ctx = useAuthCtx();

  return {
    userInfo: ctx.userInfo,
  };
}
