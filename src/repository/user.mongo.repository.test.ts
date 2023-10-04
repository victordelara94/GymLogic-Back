import { User } from '../entities/user.entity.js';
import { UserModel } from './user.mongo.model.js';
import { UserMongoRepository } from './user.mongo.repository.js';

jest.mock('fs/promises');
describe('Given the class UserMongoRepository', () => {
  describe('When i instance it', () => {
    const mockUser = {} as User;
    const mockUserNoId = {} as Omit<User, 'id'>;
    const mockExec = jest.fn().mockResolvedValue([]);

    UserModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: mockExec,
      }),
    });

    UserModel.create = jest.fn().mockReturnValue(mockUser);
    UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({}),
      }),
    });
    UserModel.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue('ok') });
    const repo = new UserMongoRepository();
    test('Then getAll should return data', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
    test('Then getById should return data', async () => {
      UserModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce({}),
        }),
      });
      const result = await repo.getById('');
      expect(result).toEqual({});
    });
    test('Then update should return data', async () => {
      const result = await repo.update(mockUser.id, mockUserNoId);
      expect(result).toEqual(mockUser);
    });
    test('Then delete should return undefined', async () => {
      const result = await repo.delete(mockUser.id);
      expect(result).toEqual(undefined);
    });
    test('Then post should return data', async () => {
      const result = await repo.create(mockUserNoId);
      expect(result).toEqual(mockUser);
    });
    test('Then search should return data', async () => {
      const result = await repo.search({ key: '', value: '' });
      expect(result).toEqual([]);
    });
  });
  describe('When i instance it', () => {
    const mockDataNoId = {} as User;

    const repo = new UserMongoRepository();
    test('Then getById should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then update should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });
      expect(repo.update('', mockDataNoId)).rejects.toThrow();
    });
    test('Then search should return errors', async () => {
      const mockKey = 'userName';
      const mockValue = 'value';
      const mockExec = jest.fn().mockReturnValue(null);
      UserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });
      expect(repo.search({ key: mockKey, value: mockValue })).rejects.toThrow();
    });
    test('Then delete should return errors', async () => {
      const mockId = '';
      UserModel.findByIdAndDelete = jest.fn().mockResolvedValueOnce(null);

      expect(repo.delete(mockId)).rejects.toThrow();
    });
    describe('When i instance it', () => {
      test('toJSON method should transform the returned object', () => {
        const user = new UserModel();
        const userObject = user.toJSON();
        expect(userObject).not.toHaveProperty('_id');
        expect(userObject).not.toHaveProperty('__v');
        expect(userObject).not.toHaveProperty('test');
        expect(userObject).toHaveProperty('id');
      });
    });
  });
});
