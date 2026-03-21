import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getStudioWallet, createWithdrawalRequest, getStudioWithdrawals } from './wallet.service';

export const getWalletSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const wallet = await getStudioWallet(studioId);
    res.status(200).json(wallet);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching wallet' });
  }
};

export const postWithdraw = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const { amount, destinationType, destinationDetails } = req.body;

    const result = await createWithdrawalRequest(studioId, amount, destinationType, destinationDetails);
    
    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      withdrawal: result.withdrawal
    });
  } catch (error: any) {
    if (error.message.includes('Insufficient available balance')) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message || 'Error processing withdrawal' });
  }
};

export const getWithdrawals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const history = await getStudioWithdrawals(studioId);
    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching withdrawals' });
  }
};
