import React, { Dispatch, SetStateAction } from 'react';
import { UserInfo } from '@vkontakte/vk-bridge';

export interface UserLimitInterface {
  limit: number;
  groupIds: number[];
}

export type UserInterface = UserInfo & {
  limits: UserLimitInterface;
};

export const UserContext = React.createContext<{
  user: UserInterface | null;
  setUser: Dispatch<SetStateAction<UserInterface | null>>;
}>({
  setUser: () => {},
  user: null,
});
