import { Request, Response } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.registerUserService(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUserService(email, password);
    
    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Login failed' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokenService(refreshToken);
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Token refresh failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await authService.forgotPasswordService(email);

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
    await authService.resetPasswordService(token, password, email);

    res.status(200).json({
      message: 'Password has been reset successfully',
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Reset password failed' });
  }
};
