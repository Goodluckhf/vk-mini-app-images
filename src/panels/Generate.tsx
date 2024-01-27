import { Panel, ScreenSpinner } from '@vkontakte/vkui';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { showAds } from '../utils/utils';
import bridge from '@vkontakte/vk-bridge';
import api from '../utils/api';
import ErrorPanel from './Error';
import { LimitError, FaceNotFound } from '../utils/exceptions';
import { UserContext } from '../store/user-context';
import {
  GenerationResultContext,
  GenerationResultInterface,
} from '../store/generation-result-context';
import { FolderPhotoInterface } from '../store/folder.interface';
import { Subscribe } from './generation-flow/Subscribe';
import { Share } from './generation-flow/Share';
import { HistoryPublication } from './generation-flow/HistoryPublication';
import { GenerationResult } from './generation-flow/GenerationResult';

const panels = {
  Subscribe,
  Share,
  HistoryPublication,
  GenerationResult,
  ErrorPanel,
};

export interface GenerateProps {
  id: string;
  photo: FolderPhotoInterface;
  go: any;
  ava: Blob;
  setSubscribeBatchNumber: Dispatch<SetStateAction<number>>;
}

export default function Generate({
  id,
  photo,
  go,
  ava,
  setSubscribeBatchNumber,
}: GenerateProps) {
  const [panel, setPanel] = useState<string | null>(null);
  const { generationResult, setGenerationResult } = useContext(
    GenerationResultContext,
  );
  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      go('error_panel');
      return;
    }
  }, [user]);

  useEffect(() => {
    const poll = async (id) => {
      try {
        const job = await api.getResult(id);

        if (job === 'PENDING') {
          return setTimeout(poll, 3_000, id);
        }

        setGenerationResult({
          ...generationResult,
          ...(job as GenerationResultInterface),
        });
        setPanel('Subscribe');
      } catch (e) {
        if (e instanceof FaceNotFound) {
          go('get_image');
        } else {
          go('error_panel');
        }
      }
    };

    const start = async () => {
      try {
        const id = await api.generate(ava, photo);
        bridge
          // @ts-ignore
          .send('VKWebAppTrackEvent', {
            event_name: 'lead',
            user_id: user?.id,
          })
          .then((result) => {
            console.log(`VKWebAppTrackEvent`, result);
          })
          .catch((error) => {
            console.error(`VKWebAppTrackEvent error`, error);
          });
        poll(id);
        await showAds(false);
      } catch (e) {
        if (e instanceof LimitError) {
          go('limit');
        } else {
          go('error_panel');
        }
      }
    };

    start();
  }, []);

  if (!panel)
    return (
      <div className="InitMenu">
        <h1 className="loading-text" style={{ marginBottom: '200px' }}>
          Пожалуйста, подождите. Идет создание вашего нового образа...
        </h1>
        <ScreenSpinner />
      </div>
    );

  const ActivePanel = panels[panel];
  return (
    <Panel id={id}>
      <ActivePanel
        setPanel={setPanel}
        setSubscribeBatchNumber={setSubscribeBatchNumber}
        go={go}
      />
    </Panel>
  );
}
