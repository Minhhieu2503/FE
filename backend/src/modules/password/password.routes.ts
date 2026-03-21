import express from 'express';
import { forgotPassword, resetPassword, changePasswordAuth } from './password.controller';
import { validateForgotPassword, validateResetPassword, validateChangePassword } from './password.validator';
import { verifyToken as protect } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

// Authorized route solely for modifying passwords inside an active session
router.post('/change-password', protect, validateChangePassword, changePasswordAuth);

export default router;
