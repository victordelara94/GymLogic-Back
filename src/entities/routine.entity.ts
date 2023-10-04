import { Exercise } from './exercise.entity.js';

export type Routine = {
  id: string;
  name: string;
  objective: string;
  level: 'principiante' | 'intermedio' | 'avanzado';
  days: [
    {
      day: number;
      exercises: [{ exercise: Exercise; sets: number; reps: number }];
    }
  ];
};
