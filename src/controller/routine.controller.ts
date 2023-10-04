/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Exercise } from '../entities/exercise.entity.js';
import { RoutineMongoRepository } from '../repository/routine.mongo.repository.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
const debug = createDebug('GL:Controller:UserController');
export class RoutineController {
  constructor(
    private repoRoutine: RoutineMongoRepository,
    private repoUser: UserMongoRepository
  ) {
    debug('instantiate');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repoRoutine.create(req.body);
      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repoRoutine.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      debug('getById');
      const data = await this.repoRoutine.getById(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const routine = await this.repoRoutine.getById(req.params.id);
      const users = await this.repoUser.search({
        key: 'actualRoutine',
        value: routine,
      });
      const cleanRoutine = {
        actualRoutine: null,
      };

      users.forEach((user) => this.repoUser.update(user.id, cleanRoutine));
      await this.repoRoutine.delete(req.params.id);
      res.json({});
    } catch (error) {
      next(error);
    }
  }

  async addExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const routine = await this.repoRoutine.getById(req.params.id);
      const {
        exercise,
        sets,
        reps,
        day,
      }: { exercise: Exercise; sets: number; reps: number; day: number } =
        req.body;
      routine.training[day - 1].exercises.push({ exercise, sets, reps });
      const updatedRoutine = await this.repoRoutine.update(routine.id, routine);
      res.json(updatedRoutine);
    } catch (error) {
      next(error);
    }
  }

  async filterRoutines(req: Request, res: Response, next: NextFunction) {
    try {
      const filteredRoutines = await this.repoRoutine.search({
        key: `${req.query.key}`,
        value: req.query.value,
      });
      res.json(filteredRoutines);
    } catch (error) {
      next(error);
    }
  }
}
