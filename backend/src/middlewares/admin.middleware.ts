import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const role = req.header('x-role');

  if (role !== 'admin') {
    res.status(403).json({
      message: 'Forbidden. Admin only.',
    });
    return;
  }

  next();
};