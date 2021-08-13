import { Router } from 'express';
import passport from 'passport';
import { celebrate, Joi, Segments } from 'celebrate';
import PaymentsController from '../../controllers/payments';

const router = Router();
router.get('/', PaymentsController.getAllPayments);

router.get(
    '/loans/:loanId',
    passport.authenticate('jwt', { session: false }, null),
    PaymentsController.getPaymentByLoanId
);

router.get(
    '/:paymentId',
    passport.authenticate('jwt', { session: false }, null),
    PaymentsController.getPayment
);

router.post(
    '/:loanId',
    passport.authenticate('jwt', { session: false }, null),
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            amount: Joi.number().required(),
            datePaid: Joi.string().required(),
            currency: Joi.string().required(),
            comment: Joi.string(),
        }),
    }),
    PaymentsController.makeLoanPayment
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }, null),
    PaymentsController.deletePayment
);

export default router;
