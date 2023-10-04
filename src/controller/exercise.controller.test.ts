import { NextFunction, Request, Response } from 'express';
import { Exercise } from '../entities/exercise.entity.js';
import { ExerciseMongoRepository } from '../repository/exercise.mongo.repository.js';
import { CloudinaryService } from '../services/files.js';
import { ExerciseController } from './exercise.controller.js';

describe('Givent the instantiate ExerciseController', () => {
  describe('When all is ok', () => {
    const mockNext = jest.fn() as NextFunction;
    let mockExerciseRepo: ExerciseMongoRepository;
    let mockExerciseController: ExerciseController;
    beforeEach(() => {
      mockExerciseRepo = {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        delete: jest.fn(),
      };
      mockExerciseController = new ExerciseController(mockExerciseRepo);
    });
    const mockReq = {
      body: { id: 'test' },
      params: { id: 'test' },
      file: { filename: 'filename', destination: 'destination' },
    } as unknown as Request;
    const mockResponse = {
      json: jest.fn(),
      status: Number,
    } as unknown as Response;
    const mockExercise = {} as Exercise;
    test('Then if we use create method', async () => {
      (mockExerciseRepo.create as jest.Mock).mockReturnValue(mockExercise);

      CloudinaryService.prototype.uploadImage = jest
        .fn()
        .mockResolvedValue(mockReq.body.image);
      await mockExerciseController.create(mockReq, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith(mockExercise);
    });

    test('Then if we use getAll method ', async () => {
      const aExerciseData = [{}];

      (mockExerciseRepo.getAll as jest.Mock).mockResolvedValue(aExerciseData);

      await mockExerciseController.getAll(mockReq, mockResponse, mockNext);
      expect(mockExerciseRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(aExerciseData);
    });
    test('Then if we use getById method', async () => {
      const mockExercise = {} as Exercise;
      (mockExerciseRepo.getById as jest.Mock).mockResolvedValue(mockExercise);

      await mockExerciseController.getById(mockReq, mockResponse, mockNext);
      expect(mockExerciseRepo.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockExercise);
    });
  });
  describe('When are errors', () => {
    const mockNext = jest.fn() as NextFunction;

    const mockExerciseRepo: ExerciseMongoRepository = {
      create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
      getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
      getById: jest.fn().mockRejectedValueOnce(new Error('GetById Error')),
      delete: jest.fn().mockRejectedValueOnce(new Error('Delete Error')),
    };
    const mockReq = {
      body: {
        image: { filename: 'filename', destination: 'destination' },
        params: { id: 'test' },
      },
    } as unknown as Request;
    const mockResponse = {
      status: Number,
      json: jest.fn(),
    } as unknown as Response;
    const mockExerciseController = new ExerciseController(mockExerciseRepo);
    test('Then if we use create, next should called with error', async () => {
      await mockExerciseController.create(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Not received a photo'));
    });
    test('Then if we use getAll, next should called with error', async () => {
      await mockExerciseController.getAll(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
    });
    test('Then if we use getById, next should called with error', async () => {
      await mockExerciseController.getById(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
