import { Routine } from '../entities/routine.entity.js';

import { RoutineModel } from './routine.mongo.model.js';
import { RoutineMongoRepository } from './routine.mongo.repository.js';

jest.mock('fs/promises');
describe('Given the class RoutineMongoRepository', () => {
  describe('When i instance it', () => {
    const mockRoutine = {} as Routine;
    const mockRoutineNoId = {} as Omit<Routine, 'id'>;
    RoutineModel.find = jest.fn().mockReturnValue({
      populate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    });
    RoutineModel.findById = jest.fn().mockReturnValue({
      populate: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    });
    RoutineModel.create = jest.fn().mockResolvedValueOnce(mockRoutine);
    RoutineModel.findByIdAndUpdate = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(mockRoutine) });
    RoutineModel.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValueOnce('ok') });
    const repo = new RoutineMongoRepository();
    test('Then getAll should return data', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
    test('Then getById should return data', async () => {
      const result = await repo.getById('');
      expect(result).toEqual([]);
    });
    test('Then update should return data', async () => {
      const result = await repo.update(mockRoutine.id, mockRoutineNoId);
      expect(result).toEqual(mockRoutine);
    });

    test('Then create should return data', async () => {
      const result = await repo.create(mockRoutineNoId);
      expect(result).toEqual(mockRoutine);
    });
    test('Then search should return data', async () => {
      const result = await repo.search({ key: '', value: '' });
      expect(result).toEqual([]);
    });

    test('Then delete ', async () => {
      await repo.delete('');
    });
  });
  describe('error cases', () => {
    const mockRoutineNoId = {} as Omit<Routine, 'id'>;

    const repo = new RoutineMongoRepository();
    const mockExec = jest.fn().mockResolvedValue(null);
    test('Then getById should return error', async () => {
      RoutineModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: mockExec }),
      });
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then update should return error', async () => {
      RoutineModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: mockExec,
      });

      expect(repo.update('', mockRoutineNoId)).rejects.toThrow();
    });
    test('Then delete should return error', async () => {
      RoutineModel.findByIdAndDelete = jest.fn().mockReturnValue(undefined);

      expect(repo.delete('')).rejects.toThrow();
    });
    test('Then search should return errors', async () => {
      const mockKey = 'test';
      const mockValue = 'test';
      RoutineModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: mockExec }),
      });
      expect(repo.search({ key: mockKey, value: mockValue })).rejects.toThrow();
    });
  });
  describe('When i instance it', () => {
    test('toJSON method should transform the returned object', () => {
      const routine = new RoutineModel();

      const routineObject = routine.toJSON();
      expect(routineObject).not.toHaveProperty('_id');
      expect(routineObject).not.toHaveProperty('__v');
      expect(routineObject).not.toHaveProperty('test');
      expect(routineObject).toHaveProperty('id');
    });
  });
});
