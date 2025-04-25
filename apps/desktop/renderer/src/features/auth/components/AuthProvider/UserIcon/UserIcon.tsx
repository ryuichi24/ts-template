import React from "react";
import { useUserInfo } from "@/features/auth";

export namespace UserIcon {
  export type Props = {};
}

export const UserIcon: React.FC<UserIcon.Props> = (props) => {
  const {} = props;
  const { userInfo } = useUserInfo();

  return (
    <div>
      <ul>
        <li>
          <span>Username: {userInfo.username}</span>
        </li>
        <li>
          <span>Email: {userInfo.email}</span>
        </li>
      </ul>
    </div>
  );
};
