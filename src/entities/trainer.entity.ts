import { Exercise } from './exercise.entity.js';
import { Routine } from './routine.entity.js';
import { User } from './user.entity.js';

export type Login = {
  userName: string;
  password: string;
};
export type Trainer = Login & {
  id: string;
  email: string;
  age: number;
  routines: Routine[];
  exercises: Exercise[];
  clients: User[];
};
