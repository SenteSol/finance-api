import { Router } from 'express';

import userRoute from './users.route';
import financeRoute from './finance.route';

const routes = Router();

routes.use('/auth', userRoute);
routes.use('/finance', financeRoute);

export default routes;
