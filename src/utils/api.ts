import axios from 'axios';
import { LimitError, UnknownError, FaceNotFound } from './exceptions';
import { GenerationResultInterface } from '../store/generation-result-context';
import { UserInterface, UserLimitInterface } from '../store/user-context';

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
    return {
      textPhoto: response.textphoto,
      textCaption: response.textcaption,
      photo: {
        relativePath: response.result,
        absolutePath: this.getImage(response.result),
      },
    };
  }

  mapVkSex(vkSex: number): string {
    return vkSex === 2 ? 'male' : 'female';
  }

  async getFolders(user: UserInterface) {
    const sex = this.mapVkSex(user.sex);
    const { data } = await axios.get(`face-swapper/base-images?sex=${sex}`);
    const startAppPhotoURI = this.getStartPhotoURI(user);
    if (startAppPhotoURI) {
      const firstPhotoURI = data[0].photos[0].name;
      if (firstPhotoURI !== startAppPhotoURI) {
        data[0].photos = [{ name: startAppPhotoURI }, ...data[0].photos];
      }
    }
    return data;
  }

  getStartPhotoURI(user: UserInterface): string | null {
    const appStartParams = new URLSearchParams(
      window.location.hash.replace('#', ''),
    );
    const id = appStartParams.get('id');
    const category = appStartParams.get('c');
    const sex = this.mapVkSex(user.sex);
    if (!id || !category) {
      return null;
    }

    return `base-images/${category}/${sex}/${id}.jpeg`;
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
    const { data } = await axios.put(`/face-swapper/limits`, {
      groupIds,
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
