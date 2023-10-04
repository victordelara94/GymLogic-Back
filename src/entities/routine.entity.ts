import { Exercise } from './exercise.entity.js';

export type Routine = {
  id: string;
  days: number;
  name: string;
  objective: string;
  level: 'principiante' | 'intermedio' | 'avanzado';
  training: [
    {
      exercises: [{ exercise: Exercise; sets: number; reps: number }];
    }
  ];
  isDeprecated: boolean;
};
