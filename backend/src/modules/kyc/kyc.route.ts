import { Router } from 'express';
import {
  approveStudioRegistration,
  getAllStudioRegistrations,
  getMyStudioRegistrationDetail,
  getMyStudioRegistrations,
  getStudioRegistrationDetailByAdmin,
  rejectStudioRegistration,
  submitStudioRegistration,
} from './kyc.controller';
import { requireAdmin } from '../../middlewares/admin.middleware';

const router = Router();

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