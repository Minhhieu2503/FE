import { Request, Response, NextFunction } from 'express';

export const validateCreateBooking = (req: Request, res: Response, next: NextFunction): void => {
  const { studioId, date, startTime, endTime, deposit } = req.body;

  if (!studioId || !date || !startTime || !endTime || typeof deposit !== 'number') {
    res.status(400).json({ message: 'Missing or invalid required booking fields.' });
    return;
  }

  // Validate date format (YYYY-MM-DD or valid ISO string)
  if (isNaN(Date.parse(date))) {
    res.status(400).json({ message: 'Invalid date format' });
    return;
  }

  next();
};

export const validateHandleBooking = (req: Request, res: Response, next: NextFunction): void => {
  const { action } = req.params;
  if (action !== 'approve' && action !== 'reject') {
    res.status(400).json({ message: 'Action must be either approve or reject' });
    return;
  }
  next();
};
