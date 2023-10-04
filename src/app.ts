import cors from 'cors';
import createDebug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { ExerciseController } from './controller/exercise.controller.js';
import { RoutineController } from './controller/routine.controller.js';
import { UserController } from './controller/user.controller.js';
import { httpErrorMiddleware } from './middlewares/http.error.middleware.js';
import { ExerciseMongoRepository } from './repository/exercise.mongo.repository.js';
import { RoutineMongoRepository } from './repository/routine.mongo.repository.js';
import { UserMongoRepository } from './repository/user.mongo.repository.js';
import { ExerciseRouter } from './router/exercise.router.js';
import { RoutineRouter } from './router/routine.router.js';
import { UserRouter } from './router/user.router.js';
import { HttpError } from './types/http.error.js';

const debug = createDebug('GL:App');
export const app = express();

debug('Started');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

const userRepository = new UserMongoRepository();
const userController = new UserController(userRepository);
const userRouter = new UserRouter(userController);
const routineRepository = new RoutineMongoRepository();
const routineController = new RoutineController(
  routineRepository,
  userRepository
);
const exerciseRepository = new ExerciseMongoRepository();
const exerciseController = new ExerciseController(exerciseRepository);
const routineRouter = new RoutineRouter(routineController);
const exerciseRouter = new ExerciseRouter(exerciseController);
app.use('/users', userRouter.router);
app.use('/routines', routineRouter.router);
app.use('/exercises', exerciseRouter.router);

app.use('/:id', (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(400, 'Bad request', 'Invalid route');
  next(error);
});

app.use(httpErrorMiddleware);
