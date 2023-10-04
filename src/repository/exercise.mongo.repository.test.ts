import { Exercise } from '../entities/exercise.entity.js';
import { ExerciseModel } from './exercise.mongo.model.js';
import { ExerciseMongoRepository } from './exercise.mongo.repository.js';

jest.mock('fs/promises');
describe('Given the class ExerciseMongoRepository', () => {
  describe('When i instance it', () => {
    const mockExercise = {} as Exercise;
    const mockExerciseNoId = {} as Omit<Exercise, 'id'>;
    ExerciseModel.find = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });
    ExerciseModel.findById = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });
    ExerciseModel.create = jest.fn().mockReturnValue(mockExercise);
    ExerciseModel.findByIdAndUpdate = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockExercise) });
    ExerciseModel.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue('ok') });
    const repo = new ExerciseMongoRepository();
    test('Then getByIdAll should return data', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
    test('Then getById should return data', async () => {
      const result = await repo.getById('');
      expect(result).toEqual([]);
    });

    test('Then delete should return undefined', async () => {
      const result = await repo.delete(mockExercise.id);
      expect(result).toEqual(undefined);
    });
    test('Then post should return data', async () => {
      const result = await repo.create(mockExerciseNoId);
      expect(result).toEqual(mockExercise);
    });
  });
  describe('When i instance it', () => {
    const repo = new ExerciseMongoRepository();
    test('Then getById should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      ExerciseModel.findById = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      expect(repo.getById('')).rejects.toThrow();
    });

    test('Then if are errors', async () => {
      const mockId = '';
      ExerciseModel.findByIdAndDelete = jest.fn().mockReturnValue(null);

      expect(repo.delete(mockId)).rejects.toThrow();
    });
    describe('When i instance it', () => {
      test('toJSON method should transform the returned object', () => {
        const exercise = new ExerciseModel();
        const exerciseObject = exercise.toJSON();
        expect(exerciseObject).not.toHaveProperty('_id');
        expect(exerciseObject).not.toHaveProperty('__v');
        expect(exerciseObject).not.toHaveProperty('test');
        expect(exerciseObject).toHaveProperty('id');
      });
    });
  });
});
