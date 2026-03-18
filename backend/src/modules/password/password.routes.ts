import express from 'express';
import { forgotPassword, resetPassword } from './password.controller';
import { validateForgotPassword, validateResetPassword } from './password.validator';

const router = express.Router();

router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

export default router;
