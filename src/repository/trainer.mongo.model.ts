import { Schema, model } from 'mongoose';
import { Trainer } from '../entities/trainer.entity';

export const trainerSchema = new Schema<Trainer>({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  clients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
  routines: [{ type: Schema.Types.ObjectId, ref: 'Routine' }],
});
trainerSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.password;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const TrainerModel = model('Trainer', trainerSchema, 'trainers');
