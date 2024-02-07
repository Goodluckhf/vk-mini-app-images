import { Button, ButtonGroup, Panel } from '@vkontakte/vkui';
import { showAds, wallPost } from '../utils/utils';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserInterface } from '../store/user-context';
import { GenerationResultContext } from '../store/generation-result-context';
import { SubscribeButton } from '../components/subscribe-button';
import { EAdsFormats } from '@vkontakte/vk-bridge';

export default function Limit({ id, go }) {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { generationResult } = useContext(GenerationResultContext);
  useEffect(() => {
    if (!user || !generationResult) {
      go('error_panel');
      return;
    }

    if (!extraGenerationAvailable) {
      setTimeout(() => {
        showAds(false, EAdsFormats.REWARD);
      }, 3000);
    }
  }, [user, generationResult]);

  const SharePost = async () => {
    setLoading(true);
    try {
      await wallPost(
        generationResult?.textPhoto,
        generationResult?.photo.relativePath,
      );
      await showAds(false, EAdsFormats.REWARD);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const onSubscribe = async () => {
    await showAds(false);
    go('init');
  };

  const extraGenerationAvailable = Boolean(
    (user?.limits.limit as number) <= 0 && user?.limits.groupIds.length,
  );

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">
        <img
          src={generationResult?.photo.absolutePath}
          style={{ width: '250px' }}
        />
        <h1>
          К сожалению, на сегодня ваш лимит на образы исчерпан.{' '}
          {extraGenerationAvailable
            ? 'Подпишитесь на нас и следите за обновлениями'
            : 'Пожалуйста, заходите завтра'}
        </h1>
        <ButtonGroup mode="vertical">
          {extraGenerationAvailable && (
            <SubscribeButton
              onSubscribe={onSubscribe}
              user={user as UserInterface}
              setUser={setUser}
              stretched
            >
              Подписаться
            </SubscribeButton>
          )}
          <Button
            size="l"
            loading={loading}
            className={extraGenerationAvailable ? '' : 'DefaultButton'}
            onClick={SharePost}
            stretched
          >
            Поделиться с друзьями
          </Button>
        </ButtonGroup>
      </div>
    </Panel>
  );
}
