import { showAds, wallPost } from '../../utils/utils';
import { Button, ButtonGroup } from '@vkontakte/vkui';
import React, { useContext, useEffect } from 'react';
import { GenerationResultContext } from '../../store/generation-result-context';
import { UserContext, UserInterface } from '../../store/user-context';
import { SubscribeButton } from '../../components/subscribe-button';
import { EAdsFormats } from '@vkontakte/vk-bridge';

export interface GenerationResultProps {
  setPanel: (string) => void;
  go: (string) => void;
}

export const GenerationResult = ({ setPanel, go }: GenerationResultProps) => {
  const { generationResult } = useContext(GenerationResultContext);
  const { user, setUser } = useContext(UserContext);
  const extraGenerationAvailable = Boolean(
    (user?.limits.limit as number) <= 0 && user?.limits.groupIds.length,
  );
  useEffect(() => {
    if (!generationResult) {
      go('error_panel');
      return;
    }

    if (Boolean(user?.limits.limit) && !extraGenerationAvailable) {
      setTimeout(() => {
        showAds(false, EAdsFormats.REWARD);
      }, 3000);
    }
  }, [generationResult, user, extraGenerationAvailable]);

  const share = async () => {
    try {
      await wallPost(
        generationResult?.textPhoto,
        generationResult?.photo.relativePath,
      );
      setPanel('HistoryPublication');
    } catch (e) {
      console.error(e);
    }
  };

  const onSubscribe = async () => {
    await showAds(false);
    go('init');
  };

  return (
    <div className="InitMenu">
      <img
        src={generationResult?.photo.absolutePath}
        style={{ width: '250px' }}
      />
      <h1>
        Ваш результат готов.{' '}
        {extraGenerationAvailable
          ? 'Подпишитесь на нас и следите за обновлением приложения'
          : 'Не забудьте поделиться новым образом с друзьями.'}
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
          onClick={share}
          size="l"
          className={extraGenerationAvailable ? '' : 'DefaultButton'}
          stretched
        >
          Поделиться с друзьями
        </Button>
        {Boolean(user?.limits.limit) && (
          <Button
            style={{ marginTop: '10px' }}
            onClick={async (e) => {
              go(e);
              await showAds(false);
            }}
            data-to="init"
            size="l"
            className="DefaultButton"
          >
            Выбрать другой образ
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
};
