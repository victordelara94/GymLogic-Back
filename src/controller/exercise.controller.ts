/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { ExerciseMongoRepository } from '../repository/exercise.mongo.repository.js';
import { CloudinaryService } from '../services/files.js';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('GL:Controller:ExerciseController');
export class ExerciseController {
  cloudinary: CloudinaryService;
  constructor(private repo: ExerciseMongoRepository) {
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

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      debug(req.query);
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
