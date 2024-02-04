import React, { Dispatch, SetStateAction } from 'react';

export interface GenerationResultInterface {
  textPhoto: string;
  textCaption: string;
  photo: {
    relativePath: string;
    absolutePath: string;
  };
  basePhoto?: {
    category: string;
    sex: string;
    photoId: string;
    extension: string;
  };

  basePhotoStartupLink?: string;
}

export const GenerationResultContext = React.createContext<{
  generationResult: GenerationResultInterface | null;
  setGenerationResult: Dispatch<SetStateAction<GenerationResultInterface>>;
}>({
  generationResult: null,
  setGenerationResult: () => {},
});
