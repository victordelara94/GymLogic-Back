import { ImgData } from '../types/image.type';

export type Exercise = {
  id: string;
  name: string;
  image: ImgData;
  sets: number;
  reps: number;
};
