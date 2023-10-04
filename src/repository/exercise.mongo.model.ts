import { Schema, model } from 'mongoose';
import { Exercise } from '../entities/exercise.entity.js';

const exerciseSchema = new Schema<Exercise>({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  image: {
    type: {
      publicId: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
      url: { type: String },
    },
  },
});
exerciseSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const ExerciseModel = model('Exercise', exerciseSchema, 'exercises');
