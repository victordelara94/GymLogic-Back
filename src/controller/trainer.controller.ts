import { NextFunction, Request, Response } from 'express';
import { Trainer } from '../entities/trainer.entity';
import { TrainerMongoRepository } from '../repository/trainer.mongo.repository';
import { Auth } from '../services/auth';
import { HttpError } from '../types/http.error';
import { TokenPayload } from '../types/token.type';
import { Controller } from './controller';

export class TrainerController extends Controller<Trainer> {
  constructor(protected repo: TrainerMongoRepository) {
    super(repo);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await Auth.hash(req.body.password);
      if (!req.file) {
        throw new HttpError(
          400,
          'Bad Request',
          'No avatar image for registration'
        );
      }
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    const error = new HttpError(401, 'UnAuthorized', 'Login unauthorized');
    try {
      const data = await this.repo.search({ key: 'userName', value: userName });

      if (!data.length) throw error;
      if (!(await Auth.compare(password, data[0].password))) {
        throw error;
      }

      const payload: TokenPayload = {
        userName: data[0].userName,
        id: data[0].id,
      };
      const token = Auth.signJWT(payload);
      res.json({ user: data[0], token });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.passwd) {
        req.body.passwd = await Auth.hash(req.body.passwd);
      }

      const { id } = req.params;
      const finalItem = await this.repo.update(id, req.body);
      res.json(finalItem);
    } catch (error) {
      next(error);
    }
  }
}
