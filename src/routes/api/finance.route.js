import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import FinanceController from '../../controllers/finance';

const router = Router();

router.get('/', FinanceController.getAllLoans);

router.get('/:id', FinanceController.getLoan);

router.post(
    '/',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            client: Joi.string().required(),
            amount: Joi.number().required(),
            currency: Joi.string().required(),
            rate: Joi.number().required(),
            dateDisbursed: Joi.string().required(),
        }),
    }),
    FinanceController.addLoan
);

router.put(
    '/:id',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            client: Joi.string(),
            amount: Joi.number(),
            currency: Joi.string(),
            rate: Joi.number(),
            dateDisbursed: Joi.string(),
        }),
    }),
    FinanceController.updateLoan
);

router.delete('/:id', FinanceController.deleteLoan);

export default router;
