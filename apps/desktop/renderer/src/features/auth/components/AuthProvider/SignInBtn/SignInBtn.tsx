import { useOauthLogin } from "@/features/auth/hooks/use-oauth-login";
import React from "react";

export namespace SignInBtn {
  export type Props = {};
}

export const SignInBtn: React.FC<SignInBtn.Props> = (props) => {
  const {} = props;
  const { continueWithOauth } = useOauthLogin("google");
  const handleSignIn = () => {
    continueWithOauth();
  };
  return (
    <div onClick={handleSignIn} style={{ cursor: "pointer" }}>
      <span>Sing in</span>
    </div>
  );
};
