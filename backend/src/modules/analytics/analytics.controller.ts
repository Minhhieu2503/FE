import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getDashboardMetrics } from './analytics.service';

export const getStudioDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const dashboardData = await getDashboardMetrics(studioId);

    // Return the combined payload!
    res.status(200).json(dashboardData);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching dashboard metrics' });
  }
};
