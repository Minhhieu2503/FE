import { Request, Response, NextFunction } from 'express';
import { VoucherType } from '../../models/voucher.model';

export const validateCreateVoucher = (req: Request, res: Response, next: NextFunction): void => {
  const { code, type, value, usageLimit, validFrom, validTo } = req.body;

  if (!code || typeof code !== 'string') {
    res.status(400).json({ message: 'Valid code string is required' });
    return;
  }
  
  if (!Object.values(VoucherType).includes(type)) {
    res.status(400).json({ message: 'Invalid voucher type (PERCENTAGE or FIXED_AMOUNT)' });
    return;
  }

  if (typeof value !== 'number' || value <= 0) {
    res.status(400).json({ message: 'Value must be a positive number' });
    return;
  }

  if (type === VoucherType.PERCENTAGE && value > 100) {
    res.status(400).json({ message: 'Percentage value cannot exceed 100' });
    return;
  }

  if (typeof usageLimit !== 'number' || usageLimit < 1) {
    res.status(400).json({ message: 'Usage limit must be at least 1' });
    return;
  }

  if (!validFrom || !validTo || new Date(validFrom) >= new Date(validTo)) {
    res.status(400).json({ message: 'validFrom must be earlier than validTo' });
    return;
  }

  next();
};
