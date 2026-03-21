import { Router } from 'express';
import {
  uploadKyc,
  viewMyKyc,
  approveStudioRegistration,
  getAllStudioRegistrations,
  getMyStudioRegistrationDetail,
  getMyStudioRegistrations,
  getStudioRegistrationDetailByAdmin,
  rejectStudioRegistration,
  submitStudioRegistration,
} from './kyc.controller';
import { validateKycSubmission } from './kyc.validator';
import { verifyToken as protect } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';

const router = Router();

// =========================
// NEW FLOW: KYC upload
// =========================

// Submit KYC - Customer requesting to upgrade to Studio
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  validateKycSubmission,
  uploadKyc
);

// Get current user's KYC details
router.get('/me', protect, viewMyKyc);

// =========================
// OLD FLOW: Studio registration
// =========================

// Customer routes
router.post('/studio-registration', submitStudioRegistration);
router.get('/studio-registration/me', getMyStudioRegistrations);
router.get('/studio-registration/me/:id', getMyStudioRegistrationDetail);

// Admin routes
router.get('/studio-registration/admin', requireAdmin, getAllStudioRegistrations);
router.get(
  '/studio-registration/admin/:id',
  requireAdmin,
  getStudioRegistrationDetailByAdmin
);
router.patch(
  '/studio-registration/admin/:id/approve',
  requireAdmin,
  approveStudioRegistration
);
router.patch(
  '/studio-registration/admin/:id/reject',
  requireAdmin,
  rejectStudioRegistration
);

export default router;