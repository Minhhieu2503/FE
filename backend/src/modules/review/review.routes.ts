import { Router } from 'express';
import {
  approveStudioContent,
  approveStudioPortfolio,
  createStudioContent,
  getAllStudioContents,
  getAllStudioPortfolios,
  getMyStudioContentDetail,
  getMyStudioContents,
  getMyStudioPortfolioDetail,
  getMyStudioPortfolios,
  getProfileReviewDetail,
  getStudioContentDetailByAdmin,
  getStudioPortfolioDetailByAdmin,
  hideStudioContent,
  rejectStudioContent,
  rejectStudioPortfolio,
  submitStudioPortfolio,
  createStudioReview,
  getStudioReviews,
  getMyStudioReviews,
  patchReviewReply,
  postMockReview,
} from './review.controller';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../models/user.model';
import { requireAdmin } from '../../middlewares/admin.middleware';

const router = Router();

// =========================
// STUDIO PORTFOLIO
// =========================
router.post('/portfolio', submitStudioPortfolio);
router.get('/portfolio/me', getMyStudioPortfolios);
router.get('/portfolio/me/:id', getMyStudioPortfolioDetail);

// =========================
// ADMIN PORTFOLIO
// =========================
router.get('/portfolio/admin', requireAdmin, getAllStudioPortfolios);
router.get('/portfolio/admin/:id', requireAdmin, getStudioPortfolioDetailByAdmin);
router.patch('/portfolio/admin/:id/approve', requireAdmin, approveStudioPortfolio);
router.patch('/portfolio/admin/:id/reject', requireAdmin, rejectStudioPortfolio);

// =========================
// ADMIN PROFILE REVIEW
// =========================
router.get('/review/profile/:id', requireAdmin, getProfileReviewDetail);

// =========================
// STUDIO CONTENT
// =========================
router.post('/content', createStudioContent);
router.get('/content/me', getMyStudioContents);
router.get('/content/me/:id', getMyStudioContentDetail);

// =========================
// ADMIN CONTENT
// =========================
router.get('/content/admin', requireAdmin, getAllStudioContents);
router.get('/content/admin/:id', requireAdmin, getStudioContentDetailByAdmin);
router.patch('/content/admin/:id/approve', requireAdmin, approveStudioContent);
router.patch('/content/admin/:id/reject', requireAdmin, rejectStudioContent);
router.patch('/content/admin/:id/hide', requireAdmin, hideStudioContent);

// =========================
// CUSTOMER REVIEW & RATING - OLD FLOW
// =========================
router.post('/studio/:studioId/review', createStudioReview);
router.get('/studio/:studioId/review', getStudioReviews);

// =========================
// NEW REVIEW FLOW
// =========================

// Studio retrieves all reviews of themselves + stats
router.get(
  '/studio/reviews/me',
  protect,
  roleMiddleware(UserRole.STUDIO),
  getMyStudioReviews
);

// Studio replies to a specific review
router.patch(
  '/:id/reply',
  protect,
  roleMiddleware(UserRole.STUDIO),
  patchReviewReply
);

// Mock customer submits a review
router.post(
  '/reviews',
  protect,
  postMockReview
);

export default router;