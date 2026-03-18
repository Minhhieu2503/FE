import { Router } from 'express';
import {
  approveStudioPortfolio,
  getAllStudioPortfolios,
  getMyStudioPortfolioDetail,
  getMyStudioPortfolios,
  getProfileReviewDetail,
  getStudioPortfolioDetailByAdmin,
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

export default router;