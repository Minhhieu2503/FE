import { Router } from 'express';
import { uploadKyc, viewMyKyc } from './kyc.controller';
import { validateKycSubmission } from './kyc.validator';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

// Submit KYC - Customer requesting to upgrade to Studio
router.post(
  '/',
  protect,
  upload.fields([{ name: 'idDocument', maxCount: 1 }, { name: 'selfie', maxCount: 1 }]),
  validateKycSubmission,
  uploadKyc
);

// Get current user's KYC details
router.get('/me', protect, viewMyKyc);

export default router;
