import { Routine } from './routine.entity';
import { User } from './user.entity';

export type Login = {
  userName: string;
  password: string;
};
export type Trainer = Login & {
  id: string;
  email: string;
  age: number;
  routines: Routine[];
  clients: User[];
};
