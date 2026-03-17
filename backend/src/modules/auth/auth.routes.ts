import express from 'express';
import { register, login, refreshToken, loginGoogle } from './auth.controller';
import { validateRegister, validateLogin, validateRefreshToken, validateGoogleLogin } from './auth.validator';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', validateRefreshToken, refreshToken);
router.post('/google-login', validateGoogleLogin, loginGoogle);

export default router;
