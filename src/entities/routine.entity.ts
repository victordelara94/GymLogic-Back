import { Exercise } from './exercise.entity.js';

export type Routine = {
  id: string;
  name: string;
  objective: string;
  level: 'principiante' | 'intermedio' | 'avanzado';
  exercises: Exercise[];
};
