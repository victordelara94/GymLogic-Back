import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.entity.js';
import { TrainerMongoRepository } from '../repository/trainer.mongo.repository.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';
import { TokenPayload } from '../types/token.type.js';
import { Controller } from './controller.js';
const debug = createDebug('GL:Controller:UserController');
export class UserController extends Controller<User> {
  constructor(protected userRepo: UserMongoRepository) {
    super(userRepo);
    debug('instantiate');
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await Auth.hash(req.body.password);

      const data = await this.userRepo.create(req.body);
      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    const error = new HttpError(401, 'UnAuthorized', 'Login unauthorized');
    try {
      const data = await this.userRepo.search({
        key: 'userName',
        value: userName,
      });

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
      debug(req.body);
      const data = await this.userRepo.update(req.body.validatedId, req.body);
      debug(data);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async changeTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerRepo = new TrainerMongoRepository();
      const user = await this.userRepo.getById(req.body.validatedId);
      if (req.body.id) {
        const trainer = await trainerRepo.getById(req.body.id);

        user.actualTrainer = trainer;
      } else {
        user.actualTrainer = null;
      }

      await this.userRepo.update(req.body.validatedId, user);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.params.id === req.body.validatedId) {
        await this.userRepo.delete(req.params.id);
        res.json({});
      }
    } catch (error) {
      next(error);
    }
  }
}
