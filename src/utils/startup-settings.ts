import { UserInterface } from '../store/user-context';

export enum SexEnum {
  male = 'male',
  female = 'female',
}

export interface StartupSettings {
  category?: string;
  photoId?: string;

  sex: SexEnum;
}

export const mapVkSex = (vkSex: number): SexEnum => {
  return vkSex === 2 ? SexEnum.male : SexEnum.female;
};

export const getStartupPhotoUrl = (settings: StartupSettings): string | null => {
  if (!settings.photoId || !settings.category) {
    return null;
  }

  return `base-images/${settings.category}/${settings.sex}/${settings.photoId}.jpeg`;
}

export const getStartupSettings = (user: UserInterface): StartupSettings => {
  const appStartParams = new URLSearchParams(
    window.location.hash.replace('#', ''),
  );
  const sex = mapVkSex(user.sex);
  const photoId = appStartParams.get('id');
  const category = appStartParams.get('c');

  if (!photoId || !category) {
    return { sex };
  }

  return {
    category,
    photoId,
    sex,
  };
};
