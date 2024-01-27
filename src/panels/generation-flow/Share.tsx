import { showAds, wallPost } from '../../utils/utils';
import { Icon28Hearts2CircleFillTwilight } from '@vkontakte/icons';
import { Button, ButtonGroup } from '@vkontakte/vkui';
import { useContext, useEffect } from 'react';
import { GenerationResultContext } from '../../store/generation-result-context';

export interface ShareProps {
  setPanel: (string) => void;
  go: (string) => void;
}

export const Share = ({ setPanel, go }: ShareProps) => {
  const { generationResult } = useContext(GenerationResultContext);
  useEffect(() => {
    if (!generationResult) {
      go('error_panel');
      return;
    }
  }, [generationResult]);

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

  return (
    <div className="InitMenu">
      <Icon28Hearts2CircleFillTwilight
        width={150}
        height={150}
        style={{ marginBottom: '30px' }}
      />
      <h1>
        Поделитесь новым образом с друзьями. Это возможность получить много
        лайков
      </h1>
      <ButtonGroup mode="vertical">
        <Button size="l" className="DefaultButton" onClick={share}>
          Поделиться на стене
        </Button>
        <Button
          size="l"
          onClick={async () => {
            await showAds(false);
            setPanel('HistoryPublication');
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
