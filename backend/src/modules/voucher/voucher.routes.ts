import { Router } from 'express';
import { postVoucher, getMyVouchers, patchVoucherStatus, postValidateCode } from './voucher.controller';
import { validateCreateVoucher } from './voucher.validator';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

// Endpoint for any user/guest trying to apply an active code
router.post('/validate', postValidateCode);

// Endpoints strictly dedicated to STUDIO owners
router.use('/studio', protect, roleMiddleware(UserRole.STUDIO));
router.post('/studio', validateCreateVoucher, postVoucher);
router.get('/studio', getMyVouchers);
router.patch('/studio/:id/status', patchVoucherStatus);

export default router;
