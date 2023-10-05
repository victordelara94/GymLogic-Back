/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import { NextFunction, Request, Response } from 'express';
import { Repository } from '../repository/repository';

export abstract class Controller<T extends { id: string }> {
  constructor(protected repo: Repository<T>) {}
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getById(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
