import { Button, ButtonGroup, Panel } from '@vkontakte/vkui';
import { wallPost } from '../utils/utils';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../store/user-context';
import { GenerationResultContext } from '../store/generation-result-context';

export default function Limit({ id, go }) {
  const [loading, setLoading] = useState(false);
  const user = useContext(UserContext);
  const { generationResult } = useContext(GenerationResultContext);
  useEffect(() => {
    if (!user || !generationResult) {
      go('error_panel');
      return;
    }
  }, [user, generationResult]);

  const SharePost = async () => {
    setLoading(true);
    try {
      await wallPost(
        generationResult?.textPhoto,
        generationResult?.photo.relativePath,
      );
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">
        <img
          src={generationResult?.photo.absolutePath}
          style={{ width: '250px' }}
        />
        <h1>
          К сожалению, на сегодня ваш лимит на образы исчерпан. Пожалуйста,
          заходите завтра
        </h1>
        <ButtonGroup mode="vertical">
          <Button
            size="l"
            loading={loading}
            className="DefaultButton"
            onClick={SharePost}
          >
            Поделиться с друзьями
          </Button>
        </ButtonGroup>
      </div>
    </Panel>
  );
}
