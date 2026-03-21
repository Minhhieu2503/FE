import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }

  const allowedRoles = ['CUSTOMER', 'STUDIO']; // Admin usually created separately or via special route
  if (role && !allowedRoles.includes(role)) {
    res.status(400).json({ message: 'Invalid role. Must be CUSTOMER or STUDIO' });
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  next();
};

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token is required' });
    return;
  }

  next();
};

export const validateGoogleLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400).json({ message: 'idToken is required' });
    return;
  }

  next();
};

