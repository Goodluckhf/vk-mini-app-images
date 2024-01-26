import './css/Init.css';
import { Panel, ScreenSpinner } from '@vkontakte/vkui';
import { useEffect } from 'react';

export default function Init({ id, go, fetchData }) {
  useEffect(() => {
    const startApp = async () => {
      await fetchData();
      go('home');
    };
    startApp();
  }, []);

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <ScreenSpinner />
    </Panel>
  );
}
