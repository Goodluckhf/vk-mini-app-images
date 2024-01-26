import './css/Home.css';
import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  HorizontalScroll,
  Panel,
  PanelHeader,
} from '@vkontakte/vkui';
import Masonry from 'react-masonry-component';
import { showAds } from '../utils/utils';
import api from '../utils/api';
import { UserContext } from '../user-context';

const MAX_COUNT = 10; // Количество фото которые будут загркжены/подгружены

const Home = ({ id, go, folders, setActivePhoto, setAva }) => {
  const [activeFolder, setActiveFolder] = useState(folders[0]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const loadingTimeout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadingTimeout();
  }, []);
  const getPhotos = async () => {
    await showAds(); // Показываем interstitial рекламу (5 сек), можно передать "reward" тогда будет загружена более дорогоая реклама (30с)
    loadingTimeout();
    setOffset(offset + MAX_COUNT); // Подгружаем еще фото с помощью смещения
  };

  useEffect(() => {
    if (!user.data.limit) {
      // Если нет генерайци, отправляем пользователя на панель с ошибкой
      go('limit');
      return null;
    }
  }, [user]);

  const childEllements = activeFolder.photos.map((photo, index) => {
    if (index < offset + MAX_COUNT) {
      let width = window.innerWidth / 2 - 10;
      if (window.innerWidth > 450) {
        width = window.innerWidth / 4 - 20;
      }

      return (
        <div
          key={photo.name}
          onClick={() => {
            fetch(user.photo_max_orig)
              .then((res) => res.blob())
              .then((blob) => {
                setAva(blob);
                setActivePhoto(photo);
                go('generate');
              });
          }}
        >
          <img
            style={{ width: width + 'px' }}
            className="MainPhoto"
            src={api.getImage(photo.name)}
          />
        </div>
      );
    }
  });

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <PanelHeader>{activeFolder.name}</PanelHeader>

      <Masonry style={{ padding: '5px' }}>{childEllements}</Masonry>

      {activeFolder.photos.length > offset + MAX_COUNT ? (
        <div style={{ padding: '10px' }} hidden={loading}>
          <Button
            className="DefaultButton"
            onClick={getPhotos}
            stretched
            size="l"
          >
            Загрузить еще
          </Button>
        </div>
      ) : null}

      <div style={{ marginBottom: '100px' }} />
      <div className="Tabbar">
        <Card style={{ borderRadius: '6px 6px 0 0' }}>
          <HorizontalScroll>
            <div
              style={{
                display: 'flex',
                width: 'max-content',
                padding: '10px 5px',
                paddingBottom: '30px',
              }}
            >
              {folders.map((folder) => {
                return (
                  <Button
                    size="l"
                    key={folder.path}
                    className={
                      folder.name === activeFolder.name ? 'DefaultButton' : null
                    }
                    onClick={() => {
                      loadingTimeout();
                      setOffset(0);
                      setActiveFolder(folder);
                    }}
                    style={{ margin: '5px' }}
                  >
                    {folder.name}
                  </Button>
                );
              })}
            </div>
          </HorizontalScroll>
        </Card>
      </div>
    </Panel>
  );
};

export default Home;
