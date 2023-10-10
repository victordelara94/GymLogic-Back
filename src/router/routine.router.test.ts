//
import { RoutineController } from '../controller/routine.controller.js';
import { RoutineRouter } from './routine.router.js';

describe('Given the class RoutineRouter', () => {
  jest.spyOn(Function.prototype, 'bind');
  const mockController = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    delete: jest.fn(),
    addExercise: jest.fn(),
    userGetAll: jest.fn(),
    filterRoutines: jest.fn(),
    update: jest.fn(),
  } as unknown as RoutineController;

  describe('When we instantiate it', () => {
    const router = new RoutineRouter(mockController);
    test('Then configure method...', () => {
      expect(router).toBeInstanceOf(RoutineRouter);
    });
  });
});
