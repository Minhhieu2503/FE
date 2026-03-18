import express from 'express';
import { register, login, refreshToken, forgotPassword, resetPassword } from './auth.controller';
import { validateRegister, validateLogin, validateRefreshToken, validateForgotPassword, validateResetPassword } from './auth.validator';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', validateRefreshToken, refreshToken);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

export default router;
