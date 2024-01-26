import bridge from '@vkontakte/vk-bridge';
import api from './api';
import moment from 'moment';

export async function getToken(scope) {
  return await bridge.send('VKWebAppGetAuthToken', {
    app_id: window.process.APP_ID,
    scope: scope,
  });
}

export async function wallPost(text, photo) {
  try {
    const token = await getToken('photos');
    const albums = await bridge.send('VKWebAppCallAPIMethod', {
      method: 'photos.getAlbums',
      params: {
        v: '5.131',
        access_token: token.access_token,
      },
    });

    let album = await albums.response.items.find(
      (x) => x.title === window.process.ALBUM,
    );
    if (!album) {
      const data = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.createAlbum',
        params: {
          title: window.process.ALBUM,
          v: '5.131',
          access_token: token.access_token,
        },
      });
      album = data.response;
    }

    const uploadServer = await bridge.send('VKWebAppCallAPIMethod', {
      method: 'photos.getUploadServer',
      params: {
        album_id: album.id,
        v: '5.131',
        access_token: token.access_token,
      },
    });

    const photoResult = await api.uploadPhoto(
      photo,
      uploadServer.response.upload_url,
    );

    let attachment = await bridge.send('VKWebAppCallAPIMethod', {
      method: 'photos.save',
      params: {
        album_id: album.id,
        server: photoResult.server,
        photos_list: photoResult.photos_list,
        hash: photoResult.hash,
        v: '5.131',
        access_token: token.access_token,
      },
    });

    const photoAttachment = attachment.response[0];
    await bridge.send('VKWebAppShowWallPostBox', {
      message: text,
      attachment: `photo${photoAttachment.owner_id}_${photoAttachment.id}`,
    });
  } catch (e) {
    console.error(e);
  }
}

export async function shareHistory(photo) {
  try {
    await bridge.send('VKWebAppShowStoryBox', {
      background_type: 'image',
      url: photo,
      attachment: {
        text: 'go_to',
        type: 'url',
        url: `https://vk.com/app${window.process.APP_ID}`,
      },
    });
  } catch (e) {
    console.error(e);
  }
}

let lastAddTime = null;

function isAddAvailable(throttle) {
  if (!throttle) {
    return true;
  }

  if (!lastAddTime) {
    return true;
  }

  const availableAddTime = moment().subtract(5, 'second');
  return availableAddTime.isAfter(lastAddTime);
}

export async function showAds(throttle = true) {
  if (!isAddAvailable(throttle)) {
    return;
  }

  try {
    await bridge.send('VKWebAppShowNativeAds', {
      ad_format: 'interstitial',
    });
  } catch (e) {
    console.error(e);
  }
  lastAddTime = moment();
}
