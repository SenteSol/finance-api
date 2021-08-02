import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import FinanceController from '../../controllers/finance';
import passport from 'passport';

const router = Router();

router.get('/', FinanceController.getAllLoans);

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }, null),
    FinanceController.getLoan
);

router.get(
    '/manager/email',
    passport.authenticate('jwt', { session: false }, null),
    FinanceController.getLoansByManager
);

router.post(
    '/',
    passport.authenticate('jwt', { session: false }, null),
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            client: Joi.string().required(),
            amount: Joi.number().required(),
            currency: Joi.string().required(),
            rate: Joi.number().required(),
            dateDisbursed: Joi.string().required(),
            comment: Joi.string(),
        }),
    }),
    FinanceController.addLoan
);

router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }, null),
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            client: Joi.string(),
            amount: Joi.number(),
            currency: Joi.string(),
            rate: Joi.number(),
            dateDisbursed: Joi.string(),
            comment: Joi.string(),
        }),
    }),
    FinanceController.updateLoan
);

router.put(
    'dateCleared/:id',
    passport.authenticate('jwt', { session: false }, null),
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            amount: Joi.number(),
            dateCleared: Joi.string().required(),
            comment: Joi.string(),
        }),
    }),
    FinanceController.clearLoan
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }, null),
    FinanceController.deleteLoan
);

export default router;
