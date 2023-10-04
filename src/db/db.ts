import createDebug from 'debug';
import mongoose from 'mongoose';
import { password, user } from '../config.js';
const debug = createDebug('GL:db');
export const dbConnect = () => {
  const uri = `mongodb+srv://${user}:${password}@cluster0.wyzrngt.mongodb.net/gymlogic?retryWrites=true&w=majority`;
  debug('db');
  return mongoose.connect(uri);
};
