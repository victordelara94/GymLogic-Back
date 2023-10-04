import createDebug from 'debug';
import { Exercise } from '../entities/exercise.entity';
import { HttpError } from '../types/http.error.js';
import { ExerciseModel } from './exercise.mongo.model.js';
const debug = createDebug('GL:Repo:ExerciseMongoRepo');
export class ExerciseMongoRepository {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<Exercise[]> {
    const data = await ExerciseModel.find().exec();
    return data;
  }

  async getById(id: string): Promise<Exercise> {
    const data = await ExerciseModel.findById(id).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Exercise not found', {
        cause: 'Trying getById',
      });

    return data;
  }

  async create(newData: Omit<Exercise, 'id'>): Promise<Exercise> {
    const data = await ExerciseModel.create(newData);
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await ExerciseModel.findByIdAndDelete(id);
    if (!result)
      throw new HttpError(
        404,
        'Not Found',
        'Exercise not found in file system',
        {
          cause: 'Trying delete',
        }
      );
  }
}
