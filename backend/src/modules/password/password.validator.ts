import { NextFunction, Request, Response } from 'express';

export const validateForgotPassword = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  next();
};

export const validateResetPassword = (req: Request, res: Response, next: NextFunction): void => {
  const { otp, password } = req.body;

  if (!otp || !password) {
    res.status(400).json({ message: 'OTP and password are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }

  next();
};

export const validateChangePassword = (req: Request, res: Response, next: NextFunction): void => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    res.status(400).json({ message: 'oldPassword, newPassword, and confirmNewPassword are required' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ message: 'New password must be at least 6 characters' });
    return;
  }

  if (newPassword !== confirmNewPassword) {
    res.status(400).json({ message: 'New password and confirm password do not match' });
    return;
  }

  next();
};
