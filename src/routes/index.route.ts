import { Router } from 'express';
import indexController from '@controllers/index.controller';
import authMiddleware from '@middlewares/auth.middleware';

const path = '/';
const IndexRoute = Router();

IndexRoute.post(`${path}`, authMiddleware, indexController.index);

export default IndexRoute;
