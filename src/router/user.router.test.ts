import { UserController } from '../controller/user.controller.js';
import { UserRouter } from './user.router.js';

describe('Given the class UserRouter', () => {
  jest.spyOn(Function.prototype, 'bind');
  const mockController = {
    register: jest.fn(),
    login: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
  } as unknown as UserController;

  describe('When we instantiate it', () => {
    const router = new UserRouter(mockController);
    test('Then configure method...', () => {
      expect(router).toBeInstanceOf(UserRouter);
    });
  });
});
