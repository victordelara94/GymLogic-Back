import { Schema } from 'mongoose';
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
  routines: [{ type: Schema.Types.ObjectId, ref: 'Routine' }],
});
