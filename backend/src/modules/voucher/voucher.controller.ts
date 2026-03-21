import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { createStudioVoucher, getStudioVouchers, toggleVoucherStatus, validateAndCalculateVoucher } from './voucher.service';

export const postVoucher = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const voucher = await createStudioVoucher(studioId, req.body);
    res.status(201).json({ message: 'Voucher created', voucher });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyVouchers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const vouchers = await getStudioVouchers(studioId);
    res.status(200).json(vouchers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const patchVoucherStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const { status } = req.body;
    
    if (!status) {
      res.status(400).json({ message: 'Missing status property' });
      return;
    }

    const updated = await toggleVoucherStatus(studioId, req.params.id as string, status);
    res.status(200).json({ message: 'Status updated', voucher: updated });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const postValidateCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, orderValue, studioId } = req.body;
    
    if (!code || typeof orderValue !== 'number') {
      res.status(400).json({ message: 'code and numerical orderValue required' });
      return;
    }

    const result = await validateAndCalculateVoucher(code, orderValue, studioId);
    
    if (!result.isValid) {
      res.status(400).json(result); 
      return;
    }
    
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error validating code' });
  }
};
