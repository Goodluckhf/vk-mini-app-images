import { shareHistory, showAds } from '../../utils/utils';
import { Icon28StoryCircleFillViolet } from '@vkontakte/icons';
import { Button, ButtonGroup } from '@vkontakte/vkui';
import { useContext, useEffect } from 'react';
import { GenerationResultContext } from '../../store/generation-result-context';

export interface HistoryPublicationProps {
  setPanel: (string) => void;
  go: (string) => void;
}

export const HistoryPublication = ({
  setPanel,
  go,
}: HistoryPublicationProps) => {
  const { generationResult } = useContext(GenerationResultContext);

  useEffect(() => {
    if (!generationResult) {
      go('error_panel');
      return;
    }
  }, [generationResult]);

  const share = async () => {
    try {
      await shareHistory(
        generationResult?.photo.absolutePath as string,
        generationResult?.basePhotoStartupLink || ''
      );
      await showAds();
      setPanel('GenerationResult');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="InitMenu">
      <Icon28StoryCircleFillViolet
        width={150}
        height={150}
        style={{ marginBottom: '30px' }}
      />
      <h1>
        Поделитесь историей. Это возможность получить много реакций от друзей
      </h1>
      <ButtonGroup mode="vertical">
        <Button size="l" className="DefaultButton" onClick={share}>
          Опубликовать историю
        </Button>
        <Button
          size="l"
          onClick={async () => {
            await showAds();
            setPanel('GenerationResult');
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
