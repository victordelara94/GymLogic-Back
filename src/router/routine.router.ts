/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { RoutineController } from '../controller/routine.controller.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';

const debug = createDebug('GL:Router:RoutineRouter');

export class RoutineRouter {
  router: express.Router;
  authInterceptor: AuthInterceptor;
  constructor(private controller: RoutineController) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthInterceptor();
    this.configure();
  }

  configure() {
    this.router.post(
      '/',
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
      '/filter',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.filterRoutines.bind(this.controller)
    );
    this.router.get(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.getById.bind(this.controller)
    );
    this.router.delete(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.authInterceptor.adminAuthentication.bind(this.authInterceptor),
      this.controller.delete.bind(this.controller)
    );
    this.router.patch(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.authInterceptor.adminAuthentication.bind(this.authInterceptor),
      this.controller.update.bind(this.controller)
    );

    this.router.patch(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.authInterceptor.adminAuthentication.bind(this.authInterceptor),
      this.controller.addExercise.bind(this.controller)
    );
  }
}
