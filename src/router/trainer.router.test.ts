import { TrainerController } from '../controller/trainer.controller.js';
import { TrainerRouter } from './trainer.router.js';

describe('Given the class TrainerRouter', () => {
  jest.spyOn(Function.prototype, 'bind');
  const mockController = {
    register: jest.fn(),
    login: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
  } as unknown as TrainerController;

  describe('When we instantiate it', () => {
    const router = new TrainerRouter(mockController);
    test('Then configure method...', () => {
      expect(router).toBeInstanceOf(TrainerRouter);
    });
  });
});
