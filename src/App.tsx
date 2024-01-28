import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  View,
  ScreenSpinner,
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  SplitLayout,
  SplitCol,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Init from './panels/Init';
import api from './utils/api';
import Limit from './panels/Limit';
import Generate from './panels/Generate';
import GetImage from './panels/GetImage';
import ErrorBoundary from './error-boundary';
import ErrorPanel from './panels/Error';
import { UserContext, UserInterface } from './store/user-context';
import {
  GenerationResultInterface,
  GenerationResultContext,
} from './store/generation-result-context';
import {
  FolderInterface,
  FolderPhotoInterface,
} from './store/folder.interface';

const App = () => {
  const [activePanel, setActivePanel] = useState('init');
  const [fetchedUser, setUser] = useState<UserInterface | null>(null);
  const [popout, setPopout] = useState<JSX.Element | null>(
    <ScreenSpinner size="large" />,
  );
  const [folders, setFolders] = useState<FolderInterface[]>([]); // Все папки с шаблонами
  const [activePhoto, setActivePhoto] = useState<FolderPhotoInterface>(); // Текущий выбранный шаблон для редактирования
  const [ava, setAva] = useState<Blob>(); // Автарка пользователя для обработки
  const [generationResult, setGenerationResult] =
    useState<GenerationResultInterface | null>(null);

  async function fetchData() {
    const user = await bridge.send('VKWebAppGetUserInfo'); // Инициализация пользователя
    const fetchedFolders = await api.getFolders(user as UserInterface); // Получаем папки
    const limits = await api.getUserLimits(); // Получаем лимит
    if (limits.generationResult) {
      setGenerationResult(limits.generationResult);
    }
    setFolders(fetchedFolders);
    setUser({
      ...user,
      limits: { ...limits.limits },
    });
    setPopout(null);
  }

  const go = (e) => {
    setActivePanel(typeof e === 'string' ? e : e.currentTarget.dataset.to);
  };

  return (
    <ErrorBoundary>
      <ConfigProvider>
        <AdaptivityProvider>
          <AppRoot>
            <UserContext.Provider value={{ user: fetchedUser, setUser }}>
              <GenerationResultContext.Provider
                value={{ generationResult, setGenerationResult }}
              >
                <SplitLayout popout={popout}>
                  <SplitCol>
                    <View activePanel={activePanel}>
                      <Init id="init" go={go} fetchData={fetchData} />
                      <Home
                        id="home"
                        go={go}
                        folders={folders}
                        setActivePhoto={setActivePhoto}
                        setAva={setAva}
                      />
                      <Limit id="limit" go={go} />
                      <Generate
                        id="generate"
                        photo={activePhoto as FolderPhotoInterface}
                        go={go}
                        ava={ava as Blob}
                      />
                      <GetImage id="get_image" setAva={setAva} go={go} />
                      <ErrorPanel id="error_panel" go={go} />
                    </View>
                  </SplitCol>
                </SplitLayout>
              </GenerationResultContext.Provider>
            </UserContext.Provider>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
