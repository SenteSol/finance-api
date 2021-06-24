import { Router } from 'express';

import userRoute from './users.route';

const routes = Router();

routes.use('/auth', userRoute);

export default routes;
