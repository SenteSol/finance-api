import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import UserController from '../../controllers/users';

const router = Router();

router.get('/', UserController.getUsers);

router.post(
    '/',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
        }),
    }),
    UserController.addUser
);

export default router;
