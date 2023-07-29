import express, { Router } from 'express';
import * as mongoose from 'mongoose';
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
  (async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes(routes);
    initializeErrorHandling();
    await initializeRedis();
  })();

  return { listen };
};


const initializeDatabase = async () => {
  if (env !== 'production') {
    mongoose.set('debug', true);
  }

  try {
    await mongoose.connect(dbConnection.url);
    logger.info(`MongoDB connected. URL: ${dbConnection.url}`);
  } catch (error) {
    if (mongoose.connection && mongoose.connection.readyState) {
      await mongoose.connection.close();
      logger.info('Connection closed');
    }
    if (error instanceof Error) {
      logger.error(`MongoDB: ${error.name}, Message: ${error.message}`);
    } else {
      logger.error(`An unexpected error occurred: ${error}`);
    }
  }
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
    logger.error(`Redis: ${error.name}, Message: ${error.message}`);
    redisClient.disconnect();
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
  app
    .listen(port, () => {
      logger.info(`Server connected. ENV: ${env} - PORT: ${port}`);
    })
    .on('error', err => {
      logger.error(`Server: ${err.name}, Message: ${err.message}`);
    });
};

export default App;
