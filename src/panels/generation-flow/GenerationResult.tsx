import { showAds, wallPost } from '../../utils/utils';
import { Button } from '@vkontakte/vkui';
import { useContext, useEffect } from 'react';
import { GenerationResultContext } from '../../store/generation-result-context';

export interface GenerationResultProps {
  setPanel: (string) => void;
  go: (string) => void;
}

export const GenerationResult = ({ setPanel, go }: GenerationResultProps) => {
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
      <img
        src={generationResult?.photo.absolutePath}
        style={{ width: '250px' }}
      />
      <h1>
        Ваш результат готов. Не забудьте поделиться новым образом с друзьями.
      </h1>

      <Button onClick={share} size="l" className="DefaultButton">
        Поделиться с друзьями
      </Button>
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
    </div>
  );
};
