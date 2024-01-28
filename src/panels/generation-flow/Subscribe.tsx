import { useContext, useEffect } from 'react';
import { UserContext, UserInterface } from '../../store/user-context';
import { Icon201CircleFillGold } from '@vkontakte/icons';
import { Button, ButtonGroup } from '@vkontakte/vkui';
import { showAds } from '../../utils/utils';
import img1 from '../../img/subscribe.png';
import { SubscribeButton } from '../../components/subscribe-button';

export interface SubscribeProps {
  setPanel: (string) => void;
  go: (number) => void;
}

export const Subscribe = ({ setPanel, go }: SubscribeProps) => {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    if (!user) {
      go('error_panel');
      return;
    }
  }, [user]);

  const onSubscribe = () => {
    setPanel('Share');
  };

  if (user?.limits.groupIds.length)
    return (
      <div className="InitMenu">
        <Icon201CircleFillGold
          width={150}
          height={150}
          style={{ marginBottom: '30px' }}
        />
        <h1>Подпишитесь на нас. И получите дополнительный образ</h1>
        <ButtonGroup mode="vertical">
          <SubscribeButton
            onSubscribe={onSubscribe}
            user={user}
            setUser={setUser}
          >
            Получить +1 Образ
          </SubscribeButton>
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
        <SubscribeButton
          onSubscribe={onSubscribe}
          user={user as UserInterface}
          setUser={setUser}
          stretched={true}
        >
          Подписаться
        </SubscribeButton>
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
