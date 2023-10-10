import createDebug from 'debug';
import { Routine } from '../entities/routine.entity';
import { HttpError } from '../types/http.error.js';
import { Repository } from './repository.js';
import { RoutineModel } from './routine.mongo.model.js';
const debug = createDebug('GL:Repo:RoutineMongoRepo');
export class RoutineMongoRepository implements Repository<Routine> {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<Routine[]> {
    const data = await RoutineModel.find().exec();
    return data;
  }

  async getById(id: string): Promise<Routine> {
    const data = await RoutineModel.findById(id).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Routine not found', {
        cause: 'Trying getById',
      });

    return data;
  }

  async create(newData: Omit<Routine, 'id'>): Promise<Routine> {
    const data = await RoutineModel.create(newData);
    return data;
  }

  async update(id: string, newData: Partial<Routine>): Promise<Routine> {
    const data = await RoutineModel.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Routine not found', {
        cause: 'Trying getById',
      });

    return data;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Routine[]> {
    const data = await RoutineModel.find({ [key]: value }).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Routine not found', {
        cause: 'Trying getById',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await RoutineModel.findByIdAndDelete(id);
    if (!result)
      throw new HttpError(
        404,
        'Not Found',
        'Routine not found in file system',
        {
          cause: 'Trying delete',
        }
      );
  }
}
