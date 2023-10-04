import { Trainer } from '../entities/trainer.entity.js';
import { TrainerModel } from './trainer.mongo.model.js';
import { TrainerMongoRepository } from './trainer.mongo.repository.js';

jest.mock('fs/promises');
describe('Given the class TrainerMongoRepository', () => {
  describe('When i instance it', () => {
    const mockTrainer = {} as Trainer;
    const mockTrainerNoId = {} as Omit<Trainer, 'id'>;
    const mockExec = jest.fn().mockResolvedValue([]);

    TrainerModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      }),
    });
    TrainerModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce({}) }),
      }),
    });
    TrainerModel.create = jest.fn().mockReturnValue(mockTrainer);

    TrainerModel.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue('ok') });
    const repo = new TrainerMongoRepository();
    test('Then getAll should return data', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
    test('Then getById should return data', async () => {
      TrainerModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce({}),
          }),
        }),
      });
      const result = await repo.getById('');
      expect(result).toEqual({});
    });
    test('Then update should return data', async () => {
      const result = await repo.update(mockTrainer.id, mockTrainerNoId);
      expect(result).toEqual(mockTrainer);
    });
    test('Then delete should return undefined', async () => {
      const result = await repo.delete(mockTrainer.id);
      expect(result).toEqual(undefined);
    });
    test('Then create should return data', async () => {
      const result = await repo.create(mockTrainerNoId);
      expect(result).toEqual(mockTrainer);
    });
    test('Then search should return data', async () => {
      const result = await repo.search({ key: 'test', value: 'test' });
      expect(result).toEqual([]);
    });
  });
  describe('When i instance it', () => {
    const mockDataNoId = {} as Trainer;

    const repo = new TrainerMongoRepository();
    test('Then getById should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      TrainerModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: mockExec,
          }),
        }),
      });
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then update should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      TrainerModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: mockExec,
          }),
        }),
      });
      expect(repo.update('', mockDataNoId)).rejects.toThrow();
    });
    test('Then search should return errors', async () => {
      const mockKey = 'TrainerName';
      const mockValue = 'value';
      const mockExec = jest.fn().mockReturnValue(null);
      TrainerModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: mockExec,
          }),
        }),
      });
      expect(repo.search({ key: mockKey, value: mockValue })).rejects.toThrow();
    });
    test('Then delete should return errors', async () => {
      const mockId = '';
      TrainerModel.findByIdAndDelete = jest.fn().mockResolvedValueOnce(null);

      expect(repo.delete(mockId)).rejects.toThrow();
    });
    describe('When i instance it', () => {
      test('toJSON method should transform the returned object', () => {
        const Trainer = new TrainerModel();
        const TrainerObject = Trainer.toJSON();
        expect(TrainerObject).not.toHaveProperty('_id');
        expect(TrainerObject).not.toHaveProperty('__v');
        expect(TrainerObject).not.toHaveProperty('test');
        expect(TrainerObject).toHaveProperty('id');
      });
    });
  });
});
