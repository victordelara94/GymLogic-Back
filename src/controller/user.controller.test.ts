import { NextFunction, Request, Response } from 'express';
import { Routine } from '../entities/routine.entity.js';
import { Trainer } from '../entities/trainer.entity.js';
import { RoutineMongoRepository } from '../repository/routine.mongo.repository.js';
import { TrainerMongoRepository } from '../repository/trainer.mongo.repository.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { UserController } from './user.controller.js';

describe('Givent the instantiate UserMongoController', () => {
  describe('When all is ok', () => {
    const mockNext = jest.fn() as NextFunction;
    let mockRepo: UserMongoRepository;
    let mockUserMongoController: UserController;
    beforeEach(() => {
      mockRepo = {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        search: jest.fn().mockResolvedValue([
          {
            userName: '',
            id: '',
          },
        ]),
        update: jest.fn(),
        delete: jest.fn(),
      };
      mockUserMongoController = new UserController(mockRepo);
    });
    const mockUserData = { id: 'test', userName: 'test' };
    test('Then if we use register method', async () => {
      (mockRepo.create as jest.Mock).mockReturnValue({
        id: 'test',
        userName: 'test',
      });
      const mockReq = {
        body: {
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        status: Number,
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.register(mockReq, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserData);
    });
    test('Then if we use login method', async () => {
      Auth.compare = jest.fn().mockResolvedValueOnce(true);
      Auth.signJWT = jest.fn().mockResolvedValueOnce('testToken');

      const mockReq = {
        body: {
          userName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.login(mockReq, mockResponse, mockNext);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use login method and not find the userName', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue([]);
      const mockReq = {
        body: {
          userName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.login(mockReq, mockResponse, mockNext);
    });
    test('Then if we use login method, with not the correct password', async () => {
      Auth.compare = jest.fn().mockResolvedValueOnce(false);

      const mockReq = {
        body: {
          userName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.login(mockReq, mockResponse, mockNext);
    });
    test('Then if we use getAll method', async () => {
      const aData = [{ id: 'test', userName: 'test' }];

      (mockRepo.getAll as jest.Mock).mockResolvedValue(aData);
      const mockReq = {} as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.getAll(mockReq, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(aData);
    });
    test('Then if we use getById method', async () => {
      const mockUserData = { id: 'test', userName: 'test' };
      (mockRepo.getById as jest.Mock).mockResolvedValue(mockUserData);
      const mockReq = {
        body: { id: 'test' },
        params: { id: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.getById(mockReq, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserData);
    });
    test('Then if we use update method', async () => {
      const mockReq = {
        body: { actualRoutine: 'test', validatedId: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      RoutineMongoRepository.prototype.getById = jest
        .fn()
        .mockResolvedValueOnce({} as Routine);
      await mockUserMongoController.update(mockReq, mockResponse, mockNext);
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use changeTrainer method with a new trainer', async () => {
      TrainerMongoRepository.prototype.getById = jest
        .fn()
        .mockResolvedValueOnce({} as Trainer);
      (mockRepo.getById as jest.Mock).mockResolvedValue(mockUserData);
      const mockReq = {
        body: { id: test, validatedId: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      await mockUserMongoController.changeTrainer(
        mockReq,
        mockResponse,
        mockNext
      );
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use changeTrainer method withOut trainer', async () => {
      TrainerMongoRepository.prototype.getById = jest
        .fn()
        .mockResolvedValueOnce({} as Trainer);
      (mockRepo.getById as jest.Mock).mockResolvedValue(mockUserData);
      const mockReq = {
        body: { validatedId: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      await mockUserMongoController.changeTrainer(
        mockReq,
        mockResponse,
        mockNext
      );
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use deleteAccount method', async () => {
      const mockReq = {
        body: { validatedId: 'test' },
        params: { id: 'test' },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      await mockUserMongoController.deleteAccount(
        mockReq,
        mockResponse,
        mockNext
      );
      expect(mockRepo.delete).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
  describe('When are errors', () => {
    const mockNext = jest.fn() as NextFunction;

    const mockRepo: UserMongoRepository = {
      create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
      getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
      getById: jest.fn().mockRejectedValueOnce(new Error('GetById Error')),
      search: jest.fn().mockRejectedValueOnce(new Error('Search Error')),
      update: jest.fn().mockRejectedValueOnce(new Error('Update Error')),
      delete: jest.fn().mockRejectedValueOnce(new Error('Delete Error')),
    };
    const mockReq = {
      body: {
        password: 'test',
        id: 'test',
        validatedId: 'test',
      },
      params: { id: 'test' },
    } as unknown as Request;
    const mockResponse = {
      status: Number,
      json: jest.fn(),
    } as unknown as Response;
    const mockUserMongoController = new UserController(mockRepo);
    test('Then if we use register, next should called with error', async () => {
      await mockUserMongoController.register(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
    });
    test('Then if we use getAll, next should called with error', async () => {
      await mockUserMongoController.getAll(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
    });
    test('Then if we use getById, next should called with error', async () => {
      await mockUserMongoController.getById(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then if we use update, next should called with error', async () => {
      await mockUserMongoController.update(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Update Error'));
    });
    test('Then if we use changeTrainer, next should called with error', async () => {
      await mockUserMongoController.changeTrainer(
        mockReq,
        mockResponse,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then if we use deleteAccount, next should called with error', async () => {
      await mockUserMongoController.deleteAccount(
        mockReq,
        mockResponse,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(new Error('Delete Error'));
    });
  });
});
