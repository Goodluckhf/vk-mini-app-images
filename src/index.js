import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import App from './App';

const runApplicationParams = new URLSearchParams(window.location.search);

window.process = {
  APP_ID: Number(runApplicationParams.get('vk_app_id')), // ID приложения
  ALBUM: 'Мой Образ', // Название альбома который будется создавться дл япубликации фото,
};

// Init VK Mini App
bridge.send('VKWebAppInit');

// Показ рекламы внизу запустится сразу при открытии приложения
bridge.send('VKWebAppShowBannerAd', {
  banner_location: 'bottom',
});

ReactDOM.render(<App />, document.getElementById('root'));
if (process.env.NODE_ENV === 'development') {
  import('./eruda').then(({ default: eruda }) => {}); //runtime download
}
