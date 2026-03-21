import { Router } from 'express';
import { getStudioDashboard } from './analytics.controller';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

// Endpoint solely restricted to STUDIO roles connecting to their Dashboard
router.get(
  '/dashboard',
  protect,
  roleMiddleware(UserRole.STUDIO),
  getStudioDashboard
);

export default router;
