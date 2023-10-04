/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { ExerciseController } from '../controller/exercise.controller.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';
import { FilesInterceptor } from '../middlewares/files.interceptor.js';

const debug = createDebug('GL:Router:ExerciseRouter');

export class ExerciseRouter {
  router: express.Router;
  authInterceptor: AuthInterceptor;
  fileInterceptor: FilesInterceptor;
  constructor(private controller: ExerciseController) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthInterceptor();
    this.fileInterceptor = new FilesInterceptor();
    this.configure();
  }

  configure() {
    this.router.post(
      '/',
      this.fileInterceptor.singleFileStore('image').bind(this.fileInterceptor),
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.authInterceptor.adminAuthentication.bind(this.authInterceptor),
      this.controller.create.bind(this.controller)
    );

    this.router.get(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.getById.bind(this.controller)
    );
  }
}
