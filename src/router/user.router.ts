/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { UserController } from '../controller/user.controller.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';

const debug = createDebug('GLRouter:UserRouter');

export class UserRouter {
  router: express.Router;
  authInterceptor: AuthInterceptor;
  constructor(private controller: UserController) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthInterceptor();
    this.configure();
  }

  configure() {
    this.router.get(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.authInterceptor.adminAuthentication.bind(this.authInterceptor),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.authInterceptor.adminAuthentication.bind(this.authInterceptor),
      this.controller.getById.bind(this.controller)
    );
    this.router.post(
      '/register',
      this.controller.register.bind(this.controller)
    );
    this.router.patch(
      '/login',

      this.controller.login.bind(this.controller)
    );
    this.router.patch(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.update.bind(this.controller)
    );
  }
}
