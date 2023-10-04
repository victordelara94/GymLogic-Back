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
  exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
});
routineSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const RoutineModel = model('Routine', routineSchema, 'routines');
