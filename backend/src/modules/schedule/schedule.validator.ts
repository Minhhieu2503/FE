import { Request, Response, NextFunction } from 'express';

export const validateUpdateSchedule = (req: Request, res: Response, next: NextFunction): void => {
  const { weeklyTemplate, markedDates } = req.body;

  if (weeklyTemplate !== undefined) {
    if (!Array.isArray(weeklyTemplate)) {
      res.status(400).json({ message: 'weeklyTemplate must be an array' });
      return;
    }
    // Basic structural validation
    for (const day of weeklyTemplate) {
      if (
        typeof day.dayOfWeek !== 'number' ||
        day.dayOfWeek < 0 ||
        day.dayOfWeek > 6 ||
        typeof day.isAvailable !== 'boolean' ||
        !Array.isArray(day.timeSlots)
      ) {
         res.status(400).json({ message: 'Invalid weeklyTemplate schema' });
         return;
      }
    }
  }

  if (markedDates !== undefined) {
    if (!Array.isArray(markedDates)) {
      res.status(400).json({ message: 'markedDates must be an array' });
      return;
    }
  }

  next();
};
