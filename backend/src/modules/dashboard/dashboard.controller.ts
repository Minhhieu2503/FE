import { Request, Response } from 'express';
import { getDashboardOverview, getFinancialReport } from './dashboard.service';

export const viewDashboard = async (_req: Request, res: Response) => {
  try {
    const data = await getDashboardOverview();

    return res.status(200).json({
      message: 'Dashboard fetched successfully.',
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to fetch dashboard.',
    });
  }
};

export const viewFinancialReports = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    const data = await getFinancialReport(
      from ? String(from) : undefined,
      to ? String(to) : undefined
    );

    return res.status(200).json({
      message: 'Financial report fetched successfully.',
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to fetch financial report.',
    });
  }
};