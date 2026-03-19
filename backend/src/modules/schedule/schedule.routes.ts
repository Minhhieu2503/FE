import { Router } from 'express';
import { getMySchedule, updateMySchedule, getPublicSchedule } from './schedule.controller';
import { validateUpdateSchedule } from './schedule.validator';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

// Routes for Studio to manage their own schedule
router.get('/me', protect, roleMiddleware(UserRole.STUDIO), getMySchedule);
router.patch('/me', protect, roleMiddleware(UserRole.STUDIO), validateUpdateSchedule, updateMySchedule);

// Public route for customers to fetch the studio's schedule template
router.get('/studio/:studioId', getPublicSchedule);

// Note: Future endpoint like `GET /studio/:studioId/available-slots?date=YYYY-MM-DD` 
// will be added to query dynamically computed slots.

export default router;
