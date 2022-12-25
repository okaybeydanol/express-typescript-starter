import express, { Router } from 'express';
import { connect, set } from 'mongoose';
import * as redis from 'redis';
import compression from 'compression';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import errorMiddleware from '@middlewares/error.middleware';
import { CREDENTIALS, JSON_LIMIT, LOG_FORMAT, NODE_ENV, ORIGIN, PORT, HOST_PATH } from '@config';
import { dbConnection } from '@databases';
import { logger, stream } from '@utils/logger';

const app = express();
const env = NODE_ENV || 'development';
const port = PORT || 3000;
const format = LOG_FORMAT || 'dev';
const path = HOST_PATH || '/';

export const redisClient = redis.createClient();

const App = (routes: Router[]) => {
  initializeDatabase();
  initializeMiddlewares();
  initializeRoutes(routes);
  initializeErrorHandling();
  initializeRedis();
  return { listen };
};

const initializeDatabase = () => {
  if (env !== 'production') {
    set('debug', true);
  }
  set('strictQuery', true);
  connect(dbConnection.url, error => {
    error !== null && logger.error(`${error.name}, Message: ${error.message}`);
    !error && logger.info(`MongoDB connected. URL: ${dbConnection.url}`);
  });
};

const initializeMiddlewares = () => {
  app.use(morgan(format, { stream }));
  app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
  app.use(hpp());
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: `${JSON_LIMIT}mb` }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};

const initializeRedis = async () => {
  redisClient.on('error', error => {
    logger.error(error.message);
  });
  redisClient.on('connect', () => {
    logger.info('Redis connected.');
  });

  await redisClient.connect();
};

const initializeRoutes = (routes: Router[]) => {
  routes.forEach(route => {
    app.use(path, route);
  });
};

const initializeErrorHandling = () => {
  app.use(errorMiddleware);
};

const listen = () => {
  app.listen(port, () => {
    logger.info(`Server connected. ENV: ${env} - PORT: ${port}`);
  });
};

export default App;
