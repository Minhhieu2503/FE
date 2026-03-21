import { Request, Response } from 'express';
import * as passwordService from './password.service';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await passwordService.forgotPasswordService(email);

    res.status(200).json({
      message: 'If that email exists, a reset link has been sent.',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Forgot password failed' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, email, password } = req.body;
    await passwordService.resetPasswordService(token, password, email);

    res.status(200).json({
      message: 'Password has been reset successfully',
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Reset password failed' });
  }
};
