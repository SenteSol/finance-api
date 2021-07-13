import { Router } from 'express';

import userRoute from './users.route';
import financeRoute from './finance.route';
import clientRoute from './client.route';

const routes = Router();

routes.use('/auth', userRoute);
routes.use('/finance', financeRoute);
routes.use('/client', clientRoute);

export default routes;
