import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.entity.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { AuthInterceptor } from './auth.interceptor.js';

describe('Given the class AuthInterceptor', () => {
  const interceptor = new AuthInterceptor();

  describe('When we use authorizate', () => {
    test('Then if all is ok', () => {
      const mockReq = {
        get: jest.fn().mockReturnValue('a b'),
        body: { validatedId: 'test' },
      } as unknown as Request;
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({ id: '' });
      const mockRes = {} as Response;
      const mockNext = jest.fn();
      interceptor.authorizate(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
    test('Then if are errors', () => {
      const mockReq = {
        get: jest.fn().mockReturnValue(undefined),
        body: { validatedId: '' },
      } as unknown as Request;
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({ id: '' });
      const mockRes = {} as Response;
      const mockNext = jest.fn() as NextFunction;
      interceptor.authorizate(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(Error('No token provided'));
    });
  });

  describe('When we use adminAuthenticacion', () => {
    test('Then if user is not an admin', async () => {
      const mockReq = {
        body: { validatedId: 'test' },
      } as unknown as Request;
      const mockUser = { id: 'test', role: 'user' } as User;
      const mockRes = {} as Response;
      const mockNext = jest.fn();
      UserMongoRepository.prototype.getById = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      await interceptor.adminAuthentication(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
    test('Then if getById return error', async () => {
      const mockReq = {
        body: { validatedId: 'test' },
      } as unknown as Request;
      const mockRes = {} as Response;
      const mockNext = jest.fn();
      UserMongoRepository.prototype.getById = jest
        .fn()
        .mockRejectedValueOnce('error');
      await interceptor.adminAuthentication(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith('error');
    });
  });
});
