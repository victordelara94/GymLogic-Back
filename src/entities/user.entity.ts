import { Routine } from './routine.entity.js';
import { Trainer } from './trainer.entity.js';

export type Login = {
  userName: string;
  password: string;
};
export type User = Login & {
  id: string;
  role: 'admin' | 'user';
  email: string;
  age: number;
  height: number;
  weight: number;
  actualRoutine: Routine | null;
  actualTrainer: Trainer | null;
  completedRoutines: Routine[];
};
