import { Router } from 'express';

import userRoute from './users.route';
import financeRoute from './finance.route';
import clientRoute from './client.route';
import paymentRoute from './payments.route';
const routes = Router();

routes.use('/auth', userRoute);
routes.use('/client', clientRoute);
routes.use('/finance', financeRoute);
routes.use('/payment', paymentRoute);

export default routes;
