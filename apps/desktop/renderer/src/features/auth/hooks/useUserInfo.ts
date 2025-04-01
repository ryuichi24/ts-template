import { useAuthCtx } from "../contexts/auth-context";

export function useUserInfo() {
  const ctx = useAuthCtx();

  return {
    userInfo: ctx.userInfo,
  };
}
