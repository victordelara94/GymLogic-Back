/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';
import { TokenPayload } from '../types/token.type.js';
const debug = createDebug('GL:Controller:UserController');
export class UserController {
  constructor(private repo: UserMongoRepository) {
    debug('instantiate');
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await Auth.hash(req.body.password);

      const data = await this.repo.create(req.body);
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      debug(req.body);
      const data = await this.repo.update(req.body.validatedId, req.body);
      debug(data);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
