import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../types/http.error';
import { Auth } from './auth';

describe('Given the class Auth', () => {
  describe('When its methods are called,', () => {
    test('Then, when the method hash() is called', () => {
      bcrypt.hash = jest.fn();
      Auth.hash('');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
    test('Then, if the password is incorrect, should throw an error', () => {
      bcrypt.compare = jest.fn();
      Auth.compare('', '');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
    test('Then, when verifyJWTGettingPayload is called', () => {
      jwt.verify = jest.fn();
      Auth.verifyJWTGettingPayload('mockedToken');
      expect(jwt.verify).toHaveBeenCalled();
    });
    test('should throw an HttpError for an invalid token', () => {
      jwt.verify = jest.fn().mockReturnValueOnce('');

      const error = new HttpError(498, 'Invalid Token');

      expect(() => Auth.verifyJWTGettingPayload('test')).toThrowError(error);
    });
    test('Then when the signJWT is called should return a token', () => {
      jwt.sign = jest.fn().mockReturnValue('test');
      const payload = { id: 'test', userName: 'test' };
      const token = Auth.signJWT(payload);
      expect(typeof token).toBe('string');
    });
  });
});
