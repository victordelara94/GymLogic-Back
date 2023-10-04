import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('GL:Middleware:auth');

debug('Loaded');
export class AuthInterceptor {
  authorizate(req: Request, _res: Response, next: NextFunction) {
    try {
      debug(req.body);
      debug('pre-authorizate');
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token)
        throw new HttpError(498, 'Invalid token', 'No token provided');
      const { id } = Auth.verifyJWTGettingPayload(token);
      req.body.validatedId = id;
      debug('authorizate');
      next();
    } catch (error) {
      next(error);
    }
  }

  async adminAuthentication(req: Request, _res: Response, next: NextFunction) {
    const userId = req.body.validatedId;
    debug('Pre-adminAuthenticate');
    try {
      const repo = new UserMongoRepository();
      const user = await repo.getById(userId);

      if (user.role !== 'admin') {
        const error = new HttpError(403, 'Forbidden', 'Not authorizate');
        next(error);
      }

      debug('adminAuthenticate');
      next();
    } catch (error) {
      next(error);
    }
  }
}
