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
} from './review.controller';
import { requireAdmin } from '../../middlewares/admin.middleware';

const router = Router();

// Studio portfolio routes
router.post('/portfolio', submitStudioPortfolio);
router.get('/portfolio/me', getMyStudioPortfolios);
router.get('/portfolio/me/:id', getMyStudioPortfolioDetail);

// Admin portfolio routes
router.get('/portfolio/admin', requireAdmin, getAllStudioPortfolios);
router.get('/portfolio/admin/:id', requireAdmin, getStudioPortfolioDetailByAdmin);
router.patch('/portfolio/admin/:id/approve', requireAdmin, approveStudioPortfolio);
router.patch('/portfolio/admin/:id/reject', requireAdmin, rejectStudioPortfolio);

// Admin profile review route
router.get('/review/profile/:id', requireAdmin, getProfileReviewDetail);

// Studio content routes
router.post('/content', createStudioContent);
router.get('/content/me', getMyStudioContents);
router.get('/content/me/:id', getMyStudioContentDetail);

// Admin content routes
router.get('/content/admin', requireAdmin, getAllStudioContents);
router.get('/content/admin/:id', requireAdmin, getStudioContentDetailByAdmin);
router.patch('/content/admin/:id/approve', requireAdmin, approveStudioContent);
router.patch('/content/admin/:id/reject', requireAdmin, rejectStudioContent);
router.patch('/content/admin/:id/hide', requireAdmin, hideStudioContent);

export default router;