import { Schema, model } from 'mongoose';
import { Routine } from '../entities/routine.entity.js';

const routineSchema = new Schema<Routine>({
  name: { type: String, required: true, unique: true },
  objective: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['principiante', 'intermedio', 'avanzado'],
    required: true,
  },
  days: [
    {
      day: { type: Number },
      exercises: [
        {
          exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
          sets: { type: Number },
          reps: { type: Number },
        },
      ],
    },
  ],
});
routineSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const RoutineModel = model('Routine', routineSchema, 'routines');
