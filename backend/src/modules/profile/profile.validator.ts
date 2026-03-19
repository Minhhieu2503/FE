import { Request, Response, NextFunction } from 'express';

export const validateUpdateProfile = (req: Request, res: Response, next: NextFunction): void => {
  const { fullName, phone, bio, packages } = req.body;

  if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim() === '')) {
    res.status(400).json({ message: 'fullName must be a non-empty string.' });
    return;
  }

  if (phone !== undefined && (typeof phone !== 'string' || phone.trim() === '')) {
    res.status(400).json({ message: 'phone must be a non-empty string.' });
    return;
  }

  if (packages !== undefined) {
    let parsedPackages;
    try {
      parsedPackages = typeof packages === 'string' ? JSON.parse(packages) : packages;
      if (!Array.isArray(parsedPackages)) {
        throw new Error();
      }
      req.body.packages = parsedPackages; // Update body with parsed array
    } catch {
      res.status(400).json({ message: 'packages must be a valid JSON array.' });
      return;
    }
  }

  next();
};
