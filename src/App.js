import React, {useState} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Init from './panels/Init';
import api from './utils/api';
import Limit from './panels/Limit';
import Generate from './panels/Generate';
import GetImage from './panels/GetImage';
import ErrorBoundary from "./error-boundary";
import ErrorPanel from './panels/Error';

const App = () => {
	const [activePanel, setActivePanel] = useState('init');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);
	const [folders, setFolders] = useState(null) // Все папки с шаблонами
	const [activePhoto, setActivePhoto] = useState(null) // Текущий выбранный шаблон для редактирования
	const [ava, setAva] = useState(null) // Автарка пользователя для обработки 

	async function fetchData() {
		const user = await bridge.send('VKWebAppGetUserInfo'); // Инициализация пользователя
		const fetchedFolders = await api.getFolders(user.sex) // Получаем папки
		user.data = await api.getUser() // Получаем лимит 
		setFolders(fetchedFolders);
		setUser(user);
		setPopout(null);
	}

	const go = e => {
		setActivePanel(typeof (e) === 'string' ? e : e.currentTarget.dataset.to);
	};

	return (
		<ErrorBoundary>
			<ConfigProvider>
				<AdaptivityProvider>
					<AppRoot>
						<SplitLayout popout={popout}>
							<SplitCol>
								<View activePanel={activePanel}>
									<Init id='init' go={go} fetchData={fetchData}/>
									<Home
										id='home'
										user={fetchedUser}
										go={go}
										folders={folders}
										setActivePhoto={setActivePhoto}
										setAva={setAva}
									/>
									<Limit id="limit" user={fetchedUser}/>
									<Generate
										id='generate'
										photo={activePhoto}
										user={fetchedUser}
										go={go}
										ava={ava}
									/>
									<GetImage
										id="get_image"
										setAva={setAva}
										go={go}
									/>
									<ErrorPanel
										id="error_panel"
										setAva={setAva}
										go={go}
									/>
								</View>
							</SplitCol>
						</SplitLayout>
					</AppRoot>
				</AdaptivityProvider>
			</ConfigProvider>
		</ErrorBoundary>
	);
}

export default App;
