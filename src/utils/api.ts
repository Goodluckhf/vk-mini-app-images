import axios from 'axios';
import bridge from '@vkontakte/vk-bridge';
import { LimitError, UnknownError, FaceNotFound } from './exceptions';
import { GenerationResultInterface } from '../store/generation-result-context';
import { UserInterface, UserLimitInterface } from '../store/user-context';
import {
  getStartupPhotoUrl,
  getStartupSettings,
  mapVkSex,
} from './startup-settings';

class API {
  baseURL = 'https://women-one-24.ru';
  apiUrl = `${this.baseURL}/api`;
  cdnUrl = `${this.baseURL}`;

  constructor() {
    axios.defaults.baseURL = this.apiUrl;
    axios.interceptors.request.use(
      function (config) {
        const params = window.location.search.slice(1);
        config.headers['Authorization'] = params;
        config.headers['ngrok-skip-browser-warning'] = '1';
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );
  }

  getImage(path) {
    return `${this.cdnUrl}/${path}`;
  }

  mapResponseToGenerationResult(response: any): GenerationResultInterface {
    const generationResult: GenerationResultInterface = {
      textPhoto: response.textphoto,
      textCaption: response.textcaption,
      photo: {
        relativePath: response.result,
        absolutePath: this.getImage(response.result),
      },
    };

    if (response.basePhoto) {
      generationResult.basePhoto = response.basePhoto;
      const { category, photoId } = response.basePhoto;
      // @ts-ignore
      generationResult.basePhotoStartupLink = `https://vk.com/app${window.process.APP_ID}#c=${category}&id=${photoId}`;
      generationResult.textPhoto = generationResult.textPhoto.replace(
        /https:\/\/vk\.com\/app[0-9]{7,11}$/,
        generationResult.basePhotoStartupLink,
      );
      generationResult.textCaption = generationResult.textCaption.replace(
        /https:\/\/vk\.com\/app[0-9]{7,11}$/,
        generationResult.basePhotoStartupLink,
      );
    }

    return generationResult;
  }

  async addLinkPhotoToCategory(user: UserInterface, foldersResponse) {
    const startAppPhotoURI = this.getStartPhotoURI(user);
    if (!startAppPhotoURI) {
      return;
    }
    const firstPhotoURI = foldersResponse[0].photos[0].name;
    if (firstPhotoURI === startAppPhotoURI) {
      return;
    }
    const firstPhotoResponse = await fetch(this.getImage(startAppPhotoURI));
    if (firstPhotoResponse.status !== 200) {
      return;
    }

    foldersResponse[0].photos = [
      { name: startAppPhotoURI },
      ...foldersResponse[0].photos,
    ];
  }

  async getFolders(user: UserInterface) {
    const sex = mapVkSex(user.sex);
    const { data } = await axios.get(`face-swapper/base-images?sex=${sex}`);
    await this.addLinkPhotoToCategory(user, data);
    return data;
  }

  getStartPhotoURI(user: UserInterface): string | null {
    const startupSettings = getStartupSettings(user);
    return getStartupPhotoUrl(startupSettings);
  }

  async getLimitsFromResponse(response: any): Promise<{
    limits: UserLimitInterface;
    generationResult?: GenerationResultInterface;
  }> {
    const result: {
      limits: UserLimitInterface;
      generationResult?: GenerationResultInterface;
    } = {
      limits: {
        limit: response.limit,
        groupIds: response.groupIds,
      },
    };

    if (response.result) {
      result.generationResult = this.mapResponseToGenerationResult(response);
    }
    return result;
  }

  async getUserLimits(): Promise<{
    limits: UserLimitInterface;
    generationResult?: GenerationResultInterface;
  }> {
    const { data } = await axios.get(`/face-swapper/limits`);
    return this.getLimitsFromResponse(data);
  }

  async updateUserLimit(groupIds: number[]): Promise<{
    limits: UserLimitInterface;
    generationResult?: GenerationResultInterface;
  }> {
    const { sign, ts } = await bridge.send('VKWebAppCreateHash', {
      payload: `groupIds=${groupIds}`,
    });
    const { data } = await axios.put(`/face-swapper/limits`, {
      groupIds,
      sign,
      ts,
    });

    return this.getLimitsFromResponse(data);
  }

  async uploadPhoto(photo, uploadUrl) {
    const { data } = await axios.post(`vk/upload`, { photo, uploadUrl });
    return data;
  }

  async generate(img, photo): Promise<string> {
    try {
      const form = new FormData();
      form.set('source', img, img.name);
      form.set('target', photo.name);
      const { data } = await axios.post('face-swapper', form);
      return data.id;
    } catch (e) {
      const status = e.response.status;
      const error = e?.response.data.error;
      if (error && status == 403) {
        throw new LimitError();
      } else {
        throw new UnknownError();
      }
    }
  }

  async getResult(id): Promise<string | GenerationResultInterface> {
    try {
      const { data } = await axios.get('face-swapper/result/' + id);
      if (typeof data === 'string') {
        return data;
      }

      return this.mapResponseToGenerationResult(data);
    } catch (e) {
      const status = e.response.status;
      const error = e?.response.data.error;
      if (error && status == 403) {
        throw new LimitError();
      } else if (error && status == 404) {
        throw new FaceNotFound();
      } else {
        throw new UnknownError();
      }
    }
  }
}

export default new API();
