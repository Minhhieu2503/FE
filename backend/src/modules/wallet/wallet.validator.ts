import { Request, Response, NextFunction } from 'express';

export const validateWithdrawal = (req: Request, res: Response, next: NextFunction): void => {
  const { amount, destinationType, destinationDetails } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: 'Withdrawal amount must be a positive number.' });
    return;
  }

  if (amount < 50000) {
    res.status(400).json({ message: 'Minimum withdrawal amount is 50,000 VND.' });
    return;
  }

  if (!destinationType || typeof destinationType !== 'string') {
    res.status(400).json({ message: 'destinationType is required (e.g. BANK_ACCOUNT).' });
    return;
  }

  if (!destinationDetails || typeof destinationDetails !== 'string') {
    res.status(400).json({ message: 'destinationDetails is required.' });
    return;
  }

  next();
};
