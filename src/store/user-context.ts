import React from 'react';
import { UserInfo } from '@vkontakte/vk-bridge';

export interface UserLimitInterface {
  limit: number;
  extraGenerationAvailable: boolean;
  groupIds: number[];
  subscribeBatchNumber: number;
}

export type UserInterface = UserInfo & {
  limits: UserLimitInterface;
};

export const UserContext = React.createContext<UserInterface | null>(null);
