import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../store/user-context';
import bridge from '@vkontakte/vk-bridge';
import api from '../../utils/api';
import { Icon201CircleFillGold } from '@vkontakte/icons';
import { Button, ButtonGroup } from '@vkontakte/vkui';
import { showAds } from '../../utils/utils';
import img1 from '../../img/subscribe.png';

export interface SubscribeProps {
  setPanel: (string) => void;
  setSubscribeBatchNumber: (number) => void;
  go: (number) => void;
}

const SUBSCRIBE_BATCH_SIZE = 2;

export const Subscribe = ({
  setPanel,
  setSubscribeBatchNumber,
  go,
}: SubscribeProps) => {
  const [loading, setLoading] = useState(false);
  const user = useContext(UserContext);
  useEffect(() => {
    if (!user) {
      go('error_panel');
      return;
    }
  }, [user]);

  const getPoints = async () => {
    if (!user) {
      return;
    }
    let status = 0;
    setLoading(true);
    const startIndex = user.limits.subscribeBatchNumber * SUBSCRIBE_BATCH_SIZE;
    const groups = user.limits.groupIds.slice(
      startIndex,
      startIndex + SUBSCRIBE_BATCH_SIZE,
    );

    for (let i = 0; i < groups.length; i++) {
      const group_id = groups[i];
      try {
        let data = await bridge.send('VKWebAppJoinGroup', {
          group_id,
        });
        if (data.result) status++;
      } catch (e) {
        console.error(e);
      }
    }

    setLoading(false);
    if (status) {
      if (!user.limits.subscribeBatchNumber) {
        setSubscribeBatchNumber(1);
      } else {
        setSubscribeBatchNumber(0);
      }
      api.updateUserLimit();
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
      setPanel('Share');
    }
  };

  if (user?.limits.extraGenerationAvailable)
    return (
      <div className="InitMenu">
        <Icon201CircleFillGold
          width={150}
          height={150}
          style={{ marginBottom: '30px' }}
        />
        <h1>Подпишитесь на нас. И получите дополнительную генерацию.</h1>
        <ButtonGroup mode="vertical">
          <Button
            onClick={getPoints}
            loading={loading}
            size="l"
            className="DefaultButton"
          >
            Подписаться +1 генерация
          </Button>
          <Button
            size="l"
            onClick={async () => {
              await showAds(false);
              setPanel('Share');
            }}
            appearance="accent"
            mode="secondary"
            stretched
          >
            Пропустить
          </Button>
        </ButtonGroup>
      </div>
    );

  return (
    <div className="InitMenu">
      <img src={img1} />
      <h1>
        Подпишитесь на нас. Будьте в курсе всех событий. Следите за новостями
      </h1>
      <ButtonGroup mode="vertical" style={{ minWidth: '250px' }}>
        <Button
          onClick={getPoints}
          loading={loading}
          size="l"
          stretched
          className="DefaultButton"
        >
          Подписаться
        </Button>
        <Button
          size="l"
          onClick={async () => {
            await showAds(false);
            setPanel('Share');
          }}
          appearance="accent"
          mode="secondary"
          stretched
        >
          Пропустить
        </Button>
      </ButtonGroup>
    </div>
  );
};
