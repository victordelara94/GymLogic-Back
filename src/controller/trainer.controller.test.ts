import { NextFunction, Request, Response } from 'express';
import { TrainerMongoRepository } from '../repository/trainer.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { CloudinaryService } from '../services/files.js';
import { ImgData } from '../types/image.type.js';
import { TrainerController } from './trainer.controller.js';

describe('Givent the instantiate TrainerMongoController', () => {
  describe('When all is ok', () => {
    const mockNext = jest.fn() as NextFunction;
    let mockRepo: TrainerMongoRepository;
    let mockTrainerController: TrainerController;
    beforeEach(() => {
      mockRepo = {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        search: jest.fn().mockResolvedValue([
          {
            TrainerName: '',
            id: '',
          },
        ]),
        update: jest.fn(),
        delete: jest.fn(),
      };
      mockTrainerController = new TrainerController(mockRepo);
    });

    test('Then if we use register method', async () => {
      const mockTrainerData = { id: 'test', userName: 'test' };
      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue({} as ImgData);
      (mockRepo.create as jest.Mock).mockReturnValue({
        id: 'test',
        userName: 'test',
      });
      const mockReq = {
        body: {
          password: 'test',
        },
        file: { filename: 'filename', destination: 'destination' },
      } as Request;
      const mockResponse = {
        status: Number,
        json: jest.fn(),
      } as unknown as Response;

      await mockTrainerController.register(mockReq, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTrainerData);
    });
    test('Then if we use login method', async () => {
      Auth.compare = jest.fn().mockResolvedValueOnce(true);
      Auth.signJWT = jest.fn().mockResolvedValueOnce('testToken');

      const mockReq = {
        body: {
          trainerName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockTrainerController.login(mockReq, mockResponse, mockNext);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use login method and not find the TrainerName', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue([]);
      const mockReq = {
        body: {
          TrainerName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockTrainerController.login(mockReq, mockResponse, mockNext);
    });
    test('Then if we use login method, with not the correct password', async () => {
      Auth.compare = jest.fn().mockResolvedValueOnce(false);

      const mockReq = {
        body: {
          TrainerName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockTrainerController.login(mockReq, mockResponse, mockNext);
    });
    test('Then if we use getAll method', async () => {
      const aData = [{ id: 'test', TrainerName: 'test' }];

      (mockRepo.getAll as jest.Mock).mockResolvedValue(aData);
      const mockReq = {} as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockTrainerController.getAll(mockReq, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(aData);
    });
    test('Then if we use getById method', async () => {
      const mockTrainerData = { id: 'test', TrainerName: 'test' };
      (mockRepo.getById as jest.Mock).mockResolvedValue(mockTrainerData);
      const mockReq = {
        body: { id: 'test' },
        params: { id: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockTrainerController.getById(mockReq, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockTrainerData);
    });
    test('Then if we use update method', async () => {
      const mockData = { id: 'test', TrainerName: 'test' };
      Auth.hash = await jest.fn().mockReturnValue('hash');
      (mockRepo.update as jest.Mock).mockResolvedValue(mockData);

      const mockReq = {
        body: { passwd: 'test' },
        params: { id: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockTrainerController.update(mockReq, mockResponse, mockNext);
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
  describe('When are errors', () => {
    const mockNext = jest.fn() as NextFunction;

    const mockRepo: TrainerMongoRepository = {
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
      },
      file: { filename: 'filename', destination: 'destination' },
      params: { id: 'test' },
    } as unknown as Request;
    const mockResponse = {
      status: Number,
      json: jest.fn(),
    } as unknown as Response;
    const mockTrainerMongoController = new TrainerController(mockRepo);
    test('Then if we use register, next should called with error', async () => {
      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue({} as ImgData);
      await mockTrainerMongoController.register(
        mockReq,
        mockResponse,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
    });
    test('Then if we use register without image, next should called with error', async () => {
      const mockReqNoFile = {
        body: {
          password: 'test',
          id: 'test',
        },
      } as Request;
      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue({} as ImgData);
      await mockTrainerMongoController.register(
        mockReqNoFile,
        mockResponse,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(
        new Error('No avatar image for registration')
      );
    });
    test('Then if we use getAll, next should called with error', async () => {
      await mockTrainerMongoController.getAll(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
    });
    test('Then if we use getById, next should called with error', async () => {
      await mockTrainerMongoController.getById(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then if we use update, next should called with error', async () => {
      await mockTrainerMongoController.update(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Update Error'));
    });
  });
});
