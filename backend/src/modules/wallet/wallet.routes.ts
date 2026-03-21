import { Router } from 'express';
import { getWalletSummary, postWithdraw, getWithdrawals } from './wallet.controller';
import { validateWithdrawal } from './wallet.validator';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

// Apply strict STUDIO authorization on all wallet endpoints
router.use(protect, roleMiddleware(UserRole.STUDIO));

// Get current wallet balances
router.get('/summary', getWalletSummary);

// Request to withdraw money
router.post('/withdraw', validateWithdrawal, postWithdraw);

// Get withdrawal history
router.get('/withdrawals', getWithdrawals);

export default router;
