import createDebug from 'debug';
import { Trainer } from '../entities/trainer.entity';
import { HttpError } from '../types/http.error';
import { Repository } from './repository';
import { TrainerModel } from './trainer.mongo.model';
const debug = createDebug('GL: repo: trainerRepo');
export class TrainerMongoRepository implements Repository<Trainer> {
  constructor() {
    debug('instantiated');
  }

  async create(newData: Omit<Trainer, 'id'>): Promise<Trainer> {
    const data = await TrainerModel.create(newData);
    return data;
  }

  async getAll(): Promise<Trainer[]> {
    const data = await TrainerModel.find()
      .populate('routines')
      .populate('clients')
      .exec();
    return data;
  }

  async getById(id: string): Promise<Trainer> {
    const data = await TrainerModel.findById(id)
      .populate('routines')
      .populate('clients')
      .exec();
    if (!data) {
      throw new HttpError(404, 'Not Found', 'Trainer not found', {
        cause: 'Trying getById',
      });
    }

    return data;
  }

  async update(id: string, newData: Partial<Trainer>): Promise<Trainer> {
    const data = await TrainerModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('routines')
      .populate('clients')
      .exec();
    if (!data) {
      throw new HttpError(404, 'Not Found', 'Trainer not found', {
        cause: 'Trying update',
      });
    }

    return data;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Trainer[]> {
    const data = await TrainerModel.find({ [key]: value })
      .populate('routines')
      .populate('clients')
      .exec();
    console.log('data', data);
    if (!data) {
      throw new HttpError(404, 'Not Found', 'Trainer not found', {
        cause: 'Trying search',
      });
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await TrainerModel.findByIdAndDelete(id);
    if (!data) {
      throw new HttpError(404, 'Not Found', 'Trainer not found', {
        cause: 'Trying delete',
      });
    }
  }
}
