import Wallet, { IWallet } from '../../models/wallet.model';
import Withdrawal, { IWithdrawal, WithdrawalStatus } from '../../models/withdrawal.model';
import Transaction, { ITransaction, TransactionType, TransactionStatus } from '../../models/transaction.model';

export const getStudioWallet = async (studioId: string): Promise<IWallet> => {
  let wallet = await Wallet.findOne({ studioId });
  
  if (!wallet) {
    // Auto-create wallet if it doesn't exist yet
    wallet = await Wallet.create({
      studioId,
      totalRevenue: 0,
      holdingBalance: 0,
      availableBalance: 0
    });
  }
  return wallet;
};

export const createWithdrawalRequest = async (
  studioId: string,
  amount: number,
  destinationType: string,
  destinationDetails: string
): Promise<{ withdrawal: IWithdrawal; transaction: ITransaction }> => {
  const wallet = await getStudioWallet(studioId);

  if (wallet.availableBalance < amount) {
    throw new Error('Insufficient available balance to withdraw this amount');
  }

  // Deduct from available balance to prevent double spending
  wallet.availableBalance -= amount;
  await wallet.save();

  // Create the Withdrawal Request
  const withdrawal = await Withdrawal.create({
    studioId,
    walletId: wallet._id,
    amount,
    destinationType,
    destinationDetails,
    status: WithdrawalStatus.PENDING
  });

  // Log the Transaction
  const transaction = await Transaction.create({
    userId: studioId,
    amount: -amount, // Negative implies cash out
    type: TransactionType.WITHDRAWAL,
    status: TransactionStatus.PENDING
  });

  return { withdrawal, transaction };
};

export const getStudioWithdrawals = async (studioId: string): Promise<IWithdrawal[]> => {
  return await Withdrawal.find({ studioId }).sort({ createdAt: -1 });
};
