import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import passport from 'passport';
import ClientController from '../../controllers/clients';

const router = Router();

router.get(
    '/',
    passport.authenticate('jwt', { session: false }, null),
    ClientController.getAllClients
);

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }, null),
    ClientController.getClient
);

router.get(
    '/manager/email',
    passport.authenticate('jwt', { session: false }, null),
    ClientController.getClientByManager
);

router.post(
    '/',
    passport.authenticate('jwt', { session: false }, null),
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            address: Joi.string().required(),
            clientName: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            clientContactEmail: Joi.string().required(),
            clientContactNumber: Joi.string().required(),
        }),
    }),
    ClientController.addClient
);

router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }, null),
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            address: Joi.string(),
            clientName: Joi.string(),
            city: Joi.string(),
            country: Joi.string(),
            clientContactEmail: Joi.string(),
            clientContactNumber: Joi.string(),
        }),
    }),
    ClientController.updateClient
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }, null),
    ClientController.deleteClient
);

export default router;
