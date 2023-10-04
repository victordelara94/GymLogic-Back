import { Routine } from './routine.entity.js';

export type Login = {
  userName: string;
  password: string;
};
export type User = Login & {
  id: string;
  userName: string;
  password: string;
  role: 'admin' | 'user';
  email: string;
  age: number;
  height: number;
  weight: number;
  actualRoutine: Routine | null;
};
