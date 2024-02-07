import { Button } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import api from '../utils/api';
import { UserInterface } from '../store/user-context';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {showAds} from "../utils/utils";

export interface SubscribeButtonProps {
  onSubscribe: () => void;
  setUser: Dispatch<SetStateAction<UserInterface | null>>;
  user: UserInterface;
  children: React.ReactNode;
  stretched?: boolean;
}

const SUBSCRIBE_BATCH_SIZE = 2;

export const SubscribeButton = ({
  onSubscribe,
  setUser,
  user,
  children,
  stretched,
}: SubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);

  const getPoints = async () => {
    setLoading(true);
    const groups = user.limits.groupIds.slice(0, SUBSCRIBE_BATCH_SIZE);
    if (!groups.length) {
      await showAds();
      onSubscribe();
      return;
    }

    const subscribedGroups: number[] = [];

    for (let i = 0; i < groups.length; i++) {
      const group_id = groups[i];
      try {
        let data = await bridge.send('VKWebAppJoinGroup', {
          group_id,
        });
        if (data.result) {
          subscribedGroups.push(group_id);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (subscribedGroups.length) {
      const newLimits = await api.updateUserLimit(subscribedGroups);
      setUser({
        ...user,
        limits: {
          ...user.limits,
          ...newLimits.limits,
        },
      });
      bridge
        // @ts-ignore
        .send('VKWebAppTrackEvent', {
          event_name: 'subscribe',
          user_id: user.id,
        })
        .then((result) => {
          console.log(`VKWebAppTrackEvent`, result);
        })
        .catch((error) => {
          console.error(`VKWebAppTrackEvent error`, error);
        });
      onSubscribe();
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={getPoints}
      loading={loading}
      size="l"
      className="DefaultButton"
      stretched={Boolean(stretched)}
    >
      {children}
    </Button>
  );
};
