import React, { Dispatch, SetStateAction } from 'react';

export interface GenerationResultInterface {
  textPhoto: string;
  textCaption: string;
  photo: {
    relativePath: string;
    absolutePath: string;
  };
}

export const GenerationResultContext = React.createContext<{
  generationResult: GenerationResultInterface | null;
  setGenerationResult: Dispatch<SetStateAction<GenerationResultInterface>>;
}>({
  generationResult: null,
  setGenerationResult: () => {},
});
