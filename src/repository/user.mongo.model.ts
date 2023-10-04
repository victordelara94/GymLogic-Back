import { Schema, model } from 'mongoose';
import { User } from '../entities/user.entity.js';

const userSchema = new Schema<User>({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  actualRoutine: {
    type: Schema.Types.ObjectId,
    ref: 'Routine',
  },
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
