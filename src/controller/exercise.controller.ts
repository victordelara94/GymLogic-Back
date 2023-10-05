import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Exercise } from '../entities/exercise.entity.js';
import { Repository } from '../repository/repository.js';
import { CloudinaryService } from '../services/files.js';
import { HttpError } from '../types/http.error.js';
import { Controller } from './controller.js';

const debug = createDebug('GL:Controller:ExerciseController');
export class ExerciseController extends Controller<Exercise> {
  cloudinary: CloudinaryService;
  constructor(protected repo: Repository<Exercise>) {
    super(repo);
    this.cloudinary = new CloudinaryService();
    debug('instantiate');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      debug(req.file, 'file');
      if (!req.file)
        throw new HttpError(417, 'Expectation failed', 'Not received a photo');
      const path = req.file.destination + '/' + req.file.filename;
      const image = await this.cloudinary.uploadImage(path);
      debug(image);
      req.body.image = image;
      debug(req.body);
      const data = await this.repo.create(req.body);
      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
