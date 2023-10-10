import { NextFunction, Request, Response } from 'express';
import { Exercise } from '../entities/exercise.entity.js';
import { Routine } from '../entities/routine.entity.js';
import { User } from '../entities/user.entity.js';
import { RoutineMongoRepository } from '../repository/routine.mongo.repository.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { RoutineController } from './routine.controller.js';

describe('Givent the instantiate routineMongoController', () => {
  describe('When all is ok', () => {
    const mockNext = jest.fn() as NextFunction;
    let mockUserRepo: UserMongoRepository;
    let mockRoutineRepo: RoutineMongoRepository;
    let mockRoutineController: RoutineController;
    beforeEach(() => {
      mockRoutineRepo = {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        search: jest.fn(),
      };
      mockUserRepo = {
        update: jest.fn(),
        search: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
      };
      mockRoutineController = new RoutineController(
        mockRoutineRepo,
        mockUserRepo
      );
    });
    const mockReq = {
      body: {
        id: 'test',
        exercise: {} as Exercise,
        reps: 10,
        sets: 10,
        day: 1,
      },
      params: { id: 'test' },
      query: { key: 'test', value: 'test' },
    } as unknown as Request;
    const mockRoutineData = {
      days: 3,
      training: [
        { exercisesPerDay: [{ exercise: {} as Exercise, sets: 10, reps: 5 }] },
      ],
    } as unknown as Routine;
    const aData = [{ id: 'test', routineName: 'test' }];
    test('Then if we use create method', async () => {
      (mockRoutineRepo.create as jest.Mock).mockReturnValue(mockRoutineData);

      const mockResponse = {
        status: Number,
        json: jest.fn(),
      } as unknown as Response;

      await mockRoutineController.create(mockReq, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRoutineData);
    });

    test('Then if we use getAll method', async () => {
      (mockRoutineRepo.getAll as jest.Mock).mockResolvedValue(aData);

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockRoutineController.getAll(mockReq, mockResponse, mockNext);
      expect(mockRoutineRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(aData);
    });
    test('Then if we use getById method', async () => {
      (mockRoutineRepo.getById as jest.Mock).mockResolvedValue(mockRoutineData);

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockRoutineController.getById(mockReq, mockResponse, mockNext);
      expect(mockRoutineRepo.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockRoutineData);
    });
    test('Then if we use addExercise method', async () => {
      (mockRoutineRepo.getById as jest.Mock).mockResolvedValueOnce(
        mockRoutineData
      );
      (mockRoutineRepo.update as jest.Mock).mockResolvedValueOnce({});

      const mockResponse = {
        json: jest.fn(),
        status: Number,
      } as unknown as Response;

      await mockRoutineController.addExercise(mockReq, mockResponse, mockNext);
      expect(mockRoutineRepo.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use update method', async () => {
      (mockRoutineRepo.update as jest.Mock).mockResolvedValueOnce({});

      const mockResponse = {
        json: jest.fn(),
        status: Number,
      } as unknown as Response;

      await mockRoutineController.update(mockReq, mockResponse, mockNext);
      expect(mockRoutineRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use delete method', async () => {
      (mockRoutineRepo.getById as jest.Mock).mockResolvedValueOnce(
        {} as Routine
      );
      (mockUserRepo.search as jest.Mock).mockResolvedValueOnce([
        { id: 'test' } as User,
      ]);
      mockUserRepo.update = jest.fn().mockResolvedValueOnce({} as User);
      (mockRoutineRepo.delete as jest.Mock).mockResolvedValueOnce({});

      mockRoutineRepo.update as jest.Mock;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockRoutineController.delete(mockReq, mockResponse, mockNext);
      expect(mockRoutineRepo.delete).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
    test('Then if we use fitlerRoutines method', async () => {
      mockRoutineRepo.search as jest.Mock;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockRoutineController.filterRoutines(
        mockReq,
        mockResponse,
        mockNext
      );
      expect(mockRoutineRepo.search).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('When are errors', () => {
    const mockNext = jest.fn() as NextFunction;
    let mockRoutineMongoController: RoutineController;
    let mockUserRepo: UserMongoRepository;
    let mockRoutineRepo: RoutineMongoRepository;
    beforeEach(() => {
      mockRoutineRepo = {
        create: jest.fn().mockRejectedValueOnce(new Error('Create Error')),
        getAll: jest.fn().mockRejectedValueOnce(new Error('GetAll Error')),
        getById: jest.fn().mockRejectedValueOnce(new Error('GetById Error')),
        update: jest.fn().mockRejectedValueOnce(new Error('Update Error')),
        delete: jest.fn().mockRejectedValueOnce(new Error('Delete Error')),
        search: jest.fn().mockRejectedValueOnce(new Error('Search Error')),
      };

      mockRoutineMongoController = new RoutineController(
        mockRoutineRepo,
        mockUserRepo
      );
    });
    const mockReq = {
      body: { id: 'test' },
      params: { id: 'test' },
      query: { key: 'test', value: 'test' },
    } as unknown as Request;
    const mockResponse = {
      status: Number,
      json: jest.fn(),
    } as unknown as Response;
    test('Then if we use create, next should called with error', async () => {
      await mockRoutineMongoController.create(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
    });
    test('Then if we use getAll, next should called with error', async () => {
      await mockRoutineMongoController.getAll(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
    });
    test('Then if we use getById, next should called with error', async () => {
      await mockRoutineMongoController.getById(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then if we use addExercise, next should called with error', async () => {
      await mockRoutineMongoController.addExercise(
        mockReq,
        mockResponse,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then if we use delete, next should called with error', async () => {
      await mockRoutineMongoController.delete(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then if we use filterRoutines, next should called with error', async () => {
      await mockRoutineMongoController.filterRoutines(
        mockReq,
        mockResponse,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(new Error('Search Error'));
    });
    test('Then if we use filterRoutines, next should called with error', async () => {
      await mockRoutineMongoController.update(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Update Error'));
    });
  });
});
