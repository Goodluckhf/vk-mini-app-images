import bridge, { EAdsFormats } from '@vkontakte/vk-bridge';
import api from './api';
import moment, { Moment } from 'moment';

export async function getToken(scope) {
  return await bridge.send('VKWebAppGetAuthToken', {
    // @ts-ignore
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
      // @ts-ignore
      (x) => x.title === window.process.ALBUM,
    );
    if (!album) {
      const data = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.createAlbum',
        params: {
          // @ts-ignore
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
      // @ts-ignore
      attachment: `photo${photoAttachment.owner_id}_${photoAttachment.id}`,
    });
  } catch (e) {
    console.error(e);
  }
}

export async function shareHistory(photo: string, appUrl: string) {
  try {
    await bridge.send('VKWebAppShowStoryBox', {
      background_type: 'image',
      url: photo,
      attachment: {
        text: 'go_to',
        type: 'url',
        url: appUrl
      },
    });
  } catch (e) {
    console.error(e);
  }
}

let lastAddTime: Moment | null = null;

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

export async function showAds(
  throttle = true,
  adFormat: EAdsFormats = EAdsFormats.INTERSTITIAL,
) {
  if (!isAddAvailable(throttle)) {
    return;
  }

  try {
    if (adFormat === EAdsFormats.REWARD) {
      await bridge.send('VKWebAppCheckNativeAds', {
        ad_format: adFormat
      })
    }
    
    await bridge.send('VKWebAppShowNativeAds', {
      // @ts-ignore
      ad_format: adFormat,
    });
  } catch (e) {
    console.error(e);
  }
  lastAddTime = moment();
}
