//
import { ExerciseController } from '../controller/exercise.controller.js';
import { ExerciseRouter } from './exercise.router.js';

describe('Given the class ExerciseRouter', () => {
  jest.spyOn(Function.prototype, 'bind');
  const mockController = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    delete: jest.fn(),
  } as unknown as ExerciseController;

  describe('When we instantiate it', () => {
    const router = new ExerciseRouter(mockController);
    test('Then configure method...', () => {
      expect(router).toBeInstanceOf(ExerciseRouter);
    });
  });
});
