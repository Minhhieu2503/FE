import { Request, Response, NextFunction } from 'express';

export const validateDeliveryUpload = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    res.status(400).json({ message: 'No photo files uploaded.' });
    return;
  }
  // Max check e.g. 20 files handled by multer config
  next();
};
