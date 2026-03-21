import { Router } from 'express';
import { requireAdmin } from '../../middlewares/admin.middleware';
import { viewDashboard, viewFinancialReports } from './dashboard.controller';

const router = Router();

router.get('/dashboard/admin', requireAdmin, viewDashboard);
router.get('/financial-reports/admin', requireAdmin, viewFinancialReports);

export default router;