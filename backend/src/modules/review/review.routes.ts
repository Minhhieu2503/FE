import { Router } from 'express';
import { getStudioReviews, patchReviewReply, postMockReview } from './review.controller';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

// Retrieve all reviews mapping to a studio + stats
router.get('/studio', protect, roleMiddleware(UserRole.STUDIO), getStudioReviews);

// Post a formal reply to a specific review
router.patch('/:id/reply', protect, roleMiddleware(UserRole.STUDIO), patchReviewReply);

// Mock customer submits a review
router.post('/', protect, postMockReview);

export default router;
