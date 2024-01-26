import './css/Init.css';
import { Button, Footer, Link, Panel, ScreenSpinner } from '@vkontakte/vkui';
import img from '../img/ava.jpg';
import { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';

export default function Init({ id, go, fetchData }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startApp = async () => {
      await fetchData();

      // Провряем заходил ли пользователь раньше
      let v = (
        await bridge.send('VKWebAppStorageGet', {
          keys: ['v'],
        })
      ).keys[0].value;

      if (v != '1') {
        setLoading(false); // если storage не совпадает версия значит надо показать приветственное окно
      } else {
        go('home'); // Приложение уже запускалось
      }
    };
    startApp();
  }, []);

  if (loading)
    return (
      <Panel id={id} style={{ minHeight: '100vh' }}>
        <ScreenSpinner />
      </Panel>
    );

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">
        <img src={img} alt="img" />
        <h1>Уникальный Образ</h1>

        <Button
          size="l"
          className="DefaultButton"
          data-to="home"
          onClick={async () => {
            setLoading(true);
            await bridge.send('VKWebAppStorageSet', {
              key: 'v',
              value: '1',
            }); // Устанавливаем storage чтобы при следующем входе не приветствовать
            go('home');
          }}
        >
          Запустить
        </Button>

        <Footer>
          Нажимая «Запустить», Вы соглашаетесь с
          <Link href="https://dev.vk.com/ru/user-agreement" target="_blank">
            {' '}
            пользовательским соглашением
          </Link>{' '}
          и
          <Link href="https://dev.vk.com/ru/privacy-policy" target="_blank">
            {' '}
            политикой конфиденциальности
          </Link>
        </Footer>
      </div>
    </Panel>
  );
}
